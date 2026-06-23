/**
 * Portfolio Gallery
 * =================
 * Images are stored in Supabase and fetched at runtime — no hardcoded images.
 *
 * HOW TO ADD NEW PORTFOLIO IMAGES
 * --------------------------------
 * 1. Go to your Supabase dashboard → Storage → portfolio bucket.
 *    Upload the image into the matching category folder, e.g.:
 *      portfolio/basements/my-project.jpg
 *      portfolio/exterior/front-stairs.jpg
 *      portfolio/kitchens/kitchen-reno.jpg
 *      portfolio/bathrooms/master-bath.jpg
 *      portfolio/decks/backyard-deck.jpg
 *      portfolio/interior/flooring-job.jpg
 *      portfolio/before-after/kitchen-ba.jpg
 *
 * 2. Go to Table Editor → portfolio_images → Insert row:
 *      title        : "Kitchen Renovation"           (optional, shown in lightbox)
 *      category     : "Kitchens"                     (must match a filter label)
 *      image_url    : <paste the public URL from Storage>
 *      storage_path : "kitchens/kitchen-reno.jpg"    (optional, for reference)
 *      sort_order   : 10                             (lower = appears first)
 *      visible      : true
 *
 *    Public URL pattern:
 *      https://ikqkpmviogbeowjqpfdp.supabase.co/storage/v1/object/public/portfolio/<path>
 *
 * 3. Refresh the website — the new image appears automatically.
 *
 * CATEGORIES (match these exactly in the category field):
 *   Basement Renovation | Exterior Work | Flooring | Kitchens |
 *   Bathrooms | Decks | Before & After
 */

import { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid, Button, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, ZoomIn, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { supabase } from '../../../utils/supabase/client';

// ─── Types ───────────────────────────────────────────────────────────────────

interface PortfolioImage {
  id: string;
  title: string | null;
  category: string;
  image_url: string;
  storage_path: string | null;
  description: string | null;
  sort_order: number;
  is_featured: boolean;
  created_at: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const ALL = 'All';

// Order categories appear in the "All" collage view
const CATEGORY_ORDER = ['Basements', 'Interior', 'Exterior', 'Kitchens', 'Bathrooms', 'Decks'];

function categoryPriority(cat: string): number {
  const i = CATEGORY_ORDER.indexOf(cat);
  return i === -1 ? 999 : i;
}

// ─── PhotoCard ────────────────────────────────────────────────────────────────
// Renders a single image card. If the image URL 404s (e.g. the file was moved
// or deleted from Storage without updating the DB row), the card hides itself
// entirely so no phantom placeholder appears in the gallery.

function PhotoCard({
  img,
  imgIndex,
  totalInGroup,
  columns = 2,
  onOpen,
}: {
  img: PortfolioImage;
  imgIndex: number;
  totalInGroup: number;
  columns?: 2 | 3;
  onOpen: () => void;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  const gridSize = columns === 3
    ? { xs: 12, sm: 6, md: 4 }
    : { xs: 12, sm: 6 };

  return (
    <Grid size={gridSize}>
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: imgIndex * 0.1 }}
        viewport={{ once: true }}
      >
        <Box
          onClick={onOpen}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
            border: '1px solid rgba(212, 149, 42, 0.15)',
            transition: 'all 0.4s',
            aspectRatio: '4/3',
            '&:hover': {
              borderColor: '#D4952A',
              boxShadow: '0 12px 40px rgba(212, 149, 42, 0.18)',
              '& .photo-overlay': { opacity: 1 },
              '& img': { transform: 'scale(1.04)' },
            },
          }}
        >
          <Box
            component="img"
            src={img.image_url}
            alt={img.category}
            loading="lazy"
            onError={() => setFailed(true)}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transition: 'transform 0.5s ease',
            }}
          />
          {/* Hover overlay */}
          <Box
            className="photo-overlay"
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(28, 28, 28, 0.55)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 0.3s ease',
            }}
          >
            <Box
              sx={{
                width: '56px',
                height: '56px',
                border: '2px solid #D4952A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(28,28,28,0.7)',
              }}
            >
              <ZoomIn size={24} style={{ color: '#D4952A' }} />
            </Box>
          </Box>
          {/* Index badge */}
          <Box
            sx={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              background: 'rgba(28,28,28,0.8)',
              border: '1px solid rgba(212,149,42,0.4)',
              padding: '4px 10px',
            }}
          >
            <Typography
              sx={{
                color: '#D4952A',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                fontFamily: "'Barlow', sans-serif",
                textTransform: 'uppercase',
              }}
            >
              {imgIndex + 1} / {totalInGroup}
            </Typography>
          </Box>
        </Box>
      </motion.div>
    </Grid>
  );
}

// ─── Portfolio ────────────────────────────────────────────────────────────────

export function Portfolio() {
  const navigate = useNavigate();

  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [categories, setCategories] = useState<string[]>([ALL]);
  const [activeCategory, setActiveCategory] = useState(ALL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  // ── Fetch from Supabase ──────────────────────────────────────────────────
  useEffect(() => {
    async function fetchImages() {
      setLoading(true);
      setError(null);

      const { data, error: sbError } = await supabase
        .from('portfolio_images')
        .select('id, title, category, image_url, storage_path, description, sort_order, is_featured, created_at')
        .eq('visible', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (sbError) {
        setError('Unable to load portfolio images. Please try again later.');
        setLoading(false);
        return;
      }

      const rows = (data ?? []) as PortfolioImage[];
      setImages(rows);

      // Derive unique categories in the order they first appear
      const seen = new Set<string>();
      const cats = [ALL];
      for (const row of rows) {
        if (!seen.has(row.category)) {
          seen.add(row.category);
          cats.push(row.category);
        }
      }
      setCategories(cats);
      setLoading(false);
    }

    fetchImages();
  }, []);

  // ── Derived ──────────────────────────────────────────────────────────────
  const isAll = activeCategory === ALL;

  const filtered = isAll
    // "All" view: sort by category priority (Basements → Interior → Exterior → …),
    // then by sort_order within each category
    ? [...images].sort((a, b) => {
        const catDiff = categoryPriority(a.category) - categoryPriority(b.category);
        return catDiff !== 0 ? catDiff : a.sort_order - b.sort_order;
      })
    : images.filter((img) => img.category === activeCategory);

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ background: '#1C1C1C', minHeight: '100vh' }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          padding: { xs: '80px 24px 60px', md: '100px 60px 80px' },
          background: 'linear-gradient(135deg, rgba(28,28,28,0.98) 0%, rgba(40,40,40,0.95) 100%)',
          borderBottom: '1px solid rgba(212, 149, 42, 0.2)',
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(212, 149, 42, 0.06) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Typography
              variant="overline"
              sx={{
                color: '#D4952A',
                fontSize: '0.85rem',
                letterSpacing: '0.3em',
                fontWeight: 600,
                marginBottom: '16px',
                display: 'block',
                fontFamily: "'Barlow', sans-serif",
              }}
            >
              OUR WORK
            </Typography>
            <Typography
              variant="h1"
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                fontSize: { xs: '3rem', md: '5rem' },
                color: '#F5EFE0',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                marginBottom: '24px',
              }}
            >
              Portfolio &{' '}
              <Box component="span" sx={{ color: '#D4952A' }}>
                Gallery
              </Box>
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#E8DFC8',
                fontSize: { xs: '1rem', md: '1.15rem' },
                lineHeight: 1.8,
                maxWidth: '680px',
                fontWeight: 300,
                fontStyle: 'italic',
                fontFamily: "'Libre Baskerville', serif",
              }}
            >
              Every project tells a story. Browse completed work from real Sheridan Built jobs — each one a
              reflection of the craftsmanship and care we bring to every home.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* ── Filter Bar ───────────────────────────────────────────────────── */}
      <Box sx={{ padding: { xs: '40px 24px 0', md: '60px 60px 0' }, background: '#1C1C1C' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography
              sx={{
                color: '#6B6B6B',
                fontSize: '0.8rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 600,
                marginRight: '8px',
              }}
            >
              Filter:
            </Typography>
            {categories.map((cat) => (
              <Button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                sx={{
                  borderRadius: 0,
                  padding: '8px 20px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontFamily: "'Barlow', sans-serif",
                  transition: 'all 0.25s',
                  ...(activeCategory === cat
                    ? { background: '#D4952A', color: '#1C1C1C', '&:hover': { background: '#E8B050' } }
                    : {
                        background: 'transparent',
                        color: '#E8DFC8',
                        border: '1px solid rgba(212, 149, 42, 0.3)',
                        '&:hover': { background: 'rgba(212, 149, 42, 0.1)', borderColor: '#D4952A', color: '#D4952A' },
                      }),
                }}
              >
                {cat}
              </Button>
            ))}
          </Box>
          <Box
            sx={{
              height: '1px',
              background: 'linear-gradient(90deg, rgba(212,149,42,0.4) 0%, transparent 100%)',
              marginTop: '32px',
            }}
          />
        </Container>
      </Box>

      {/* ── Gallery Body ─────────────────────────────────────────────────── */}
      <Box sx={{ padding: { xs: '60px 24px', md: '80px 60px' } }}>
        <Container maxWidth="lg">

          {/* Loading */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '120px 0', gap: '16px' }}>
              <CircularProgress size={28} sx={{ color: '#D4952A' }} />
              <Typography sx={{ color: '#6B6B6B', fontFamily: "'Barlow', sans-serif", fontSize: '0.9rem', letterSpacing: '0.1em' }}>
                Loading gallery...
              </Typography>
            </Box>
          )}

          {/* Error */}
          {!loading && error && (
            <Box
              sx={{
                textAlign: 'center',
                padding: '80px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <AlertCircle size={32} style={{ color: '#D4952A' }} />
              <Typography sx={{ color: '#E8DFC8', fontFamily: "'Libre Baskerville', serif", fontSize: '1rem', fontStyle: 'italic' }}>
                {error}
              </Typography>
            </Box>
          )}

          {/* Empty */}
          {!loading && !error && filtered.length === 0 && (
            <Box sx={{ textAlign: 'center', padding: '80px 0' }}>
              <Typography sx={{ color: '#6B6B6B', fontFamily: "'Libre Baskerville', serif", fontSize: '1.1rem', fontStyle: 'italic' }}>
                No projects in this category yet — check back soon.
              </Typography>
            </Box>
          )}

          {/* ── "All" collage: flat 3-column grid, ordered by category ── */}
          {!loading && !error && isAll && filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Grid container spacing={1}>
                {filtered.map((img, i) => (
                  <PhotoCard
                    key={img.id}
                    img={img}
                    imgIndex={i}
                    totalInGroup={filtered.length}
                    columns={3}
                    onOpen={() => setLightbox({ src: img.image_url, alt: img.category })}
                  />
                ))}
              </Grid>
            </motion.div>
          )}

          {/* ── Filtered view: labeled flat 2-column grid ─────────────── */}
          {!loading && !error && !isAll && filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                <Box sx={{ width: '48px', height: '3px', background: '#D4952A', flexShrink: 0 }} />
                <Typography
                  variant="overline"
                  sx={{
                    color: '#D4952A',
                    fontSize: '0.8rem',
                    letterSpacing: '0.25em',
                    fontWeight: 600,
                    fontFamily: "'Barlow', sans-serif",
                  }}
                >
                  {activeCategory}
                </Typography>
              </Box>
              <Grid container spacing={2}>
                {filtered.map((img, i) => (
                  <PhotoCard
                    key={img.id}
                    img={img}
                    imgIndex={i}
                    totalInGroup={filtered.length}
                    columns={2}
                    onOpen={() => setLightbox({ src: img.image_url, alt: img.category })}
                  />
                ))}
              </Grid>
            </motion.div>
          )}

        </Container>
      </Box>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          padding: { xs: '80px 24px', md: '100px 60px' },
          background: 'linear-gradient(180deg, #1C1C1C 0%, #0F0F0F 100%)',
          borderTop: '1px solid rgba(212, 149, 42, 0.2)',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="overline"
              sx={{
                color: '#D4952A',
                fontSize: '0.85rem',
                letterSpacing: '0.3em',
                fontWeight: 600,
                marginBottom: '16px',
                display: 'block',
                fontFamily: "'Barlow', sans-serif",
              }}
            >
              YOUR PROJECT NEXT
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                color: '#F5EFE0',
                marginBottom: '24px',
                lineHeight: 1.2,
              }}
            >
              Ready to Build Something{' '}
              <Box component="span" sx={{ color: '#D4952A' }}>
                Exceptional?
              </Box>
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#E8DFC8',
                fontSize: '1.1rem',
                lineHeight: 1.8,
                fontWeight: 300,
                marginBottom: '48px',
                fontFamily: "'Barlow', sans-serif",
              }}
            >
              Every project in this gallery started with a single conversation. Let's start yours.
            </Typography>
            <Button
              onClick={() => navigate('/quote')}
              endIcon={<ArrowRight />}
              sx={{
                background: '#D4952A',
                color: '#1C1C1C',
                padding: '16px 48px',
                fontSize: '0.9rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                borderRadius: 0,
                fontFamily: "'Barlow', sans-serif",
                transition: 'all 0.3s',
                '&:hover': {
                  background: '#E8B050',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(212, 149, 42, 0.3)',
                },
              }}
            >
              Request a Consultation
            </Button>
          </motion.div>
        </Container>
      </Box>

      {/* ── Lightbox ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(15, 15, 15, 0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              cursor: 'zoom-out',
            }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ position: 'relative', maxWidth: '1200px', width: '100%' }}
              onClick={(e) => e.stopPropagation()}
            >
              <Box
                onClick={() => setLightbox(null)}
                sx={{
                  position: 'absolute',
                  top: '-48px',
                  right: 0,
                  width: '40px',
                  height: '40px',
                  border: '1px solid rgba(212,149,42,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': { background: 'rgba(212,149,42,0.15)', borderColor: '#D4952A' },
                }}
              >
                <X size={20} style={{ color: '#F5EFE0' }} />
              </Box>
              <Box
                component="img"
                src={lightbox.src}
                alt={lightbox.alt}
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '85vh',
                  objectFit: 'contain',
                  display: 'block',
                  border: '1px solid rgba(212,149,42,0.25)',
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
