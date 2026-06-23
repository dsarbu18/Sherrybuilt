import { useState } from 'react';
import { Container, Box, Typography, Grid, Button } from '@mui/material';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, ZoomIn } from 'lucide-react';
import { useNavigate } from 'react-router';
import gregBsmt from '../../imports/GregBsmt.png';
import gregBsmt1 from '../../imports/GregBsmt1.png';
import joeStairs from '../../imports/JoeStairs.jpeg';
import joeStairs1 from '../../imports/JoeStairs1.JPG';
import rayAppt from '../../imports/RayAppt.jpeg';
import rayAppt1 from '../../imports/RayAppt1.jpeg';

type Category = 'All' | 'Basement Finishing' | 'Exterior Work' | 'Condo Renovation';

interface Project {
  id: string;
  title: string;
  category: Category;
  location: string;
  description: string;
  photos: { src: string; alt: string }[];
}

const projects: Project[] = [
  {
    id: 'greg-basement',
    title: "Greg's Basement",
    category: 'Basement Finishing',
    location: 'Toronto, ON',
    description:
      'Full basement finish featuring an open-concept layout, custom wet bar with wine fridge, dedicated laundry area, and a bespoke entertainment wall with integrated TV surround and floor-to-ceiling cabinetry.',
    photos: [
      { src: gregBsmt, alt: "Greg's basement — open concept with wet bar and laundry" },
      { src: gregBsmt1, alt: "Greg's basement — custom entertainment wall with cabinetry" },
    ],
  },
  {
    id: 'joe-stairs',
    title: "Joe's Exterior Stairs",
    category: 'Exterior Work',
    location: 'Toronto, ON',
    description:
      "Complete exterior stair rebuild using natural stone treads and hand-set flagging, paired with custom powder-coated steel railings. Built to last through harsh Canadian winters while elevating the home's curb appeal.",
    photos: [
      { src: joeStairs, alt: "Joe's exterior stone stairs — front angle" },
      { src: joeStairs1, alt: "Joe's exterior stone stairs — side angle" },
    ],
  },
  {
    id: 'ray-apartment',
    title: "Ray's Condo Renovation",
    category: 'Condo Renovation',
    location: 'Toronto, ON',
    description:
      'Interior condo renovation including full LVP flooring installation throughout, trim and baseboard work, and bedroom refresh. Clean, modern finishes tailored to downtown high-rise living.',
    photos: [
      { src: rayAppt, alt: "Ray's condo — LVP flooring and floor-to-ceiling windows" },
      { src: rayAppt1, alt: "Ray's condo — bedroom with new flooring and trim" },
    ],
  },
];

const categories: Category[] = ['All', 'Basement Finishing', 'Exterior Work', 'Condo Renovation'];

export function Portfolio() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  const filtered =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <Box sx={{ background: '#1C1C1C', minHeight: '100vh' }}>
      {/* Hero */}
      <Box
        sx={{
          padding: { xs: '80px 24px 60px', md: '100px 60px 80px' },
          background:
            'linear-gradient(135deg, rgba(28,28,28,0.98) 0%, rgba(40,40,40,0.95) 100%)',
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
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

      {/* Filter Bar */}
      <Box
        sx={{
          padding: { xs: '40px 24px 0', md: '60px 60px 0' },
          background: '#1C1C1C',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
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
                    ? {
                        background: '#D4952A',
                        color: '#1C1C1C',
                        '&:hover': { background: '#E8B050' },
                      }
                    : {
                        background: 'transparent',
                        color: '#E8DFC8',
                        border: '1px solid rgba(212, 149, 42, 0.3)',
                        '&:hover': {
                          background: 'rgba(212, 149, 42, 0.1)',
                          borderColor: '#D4952A',
                          color: '#D4952A',
                        },
                      }),
                }}
              >
                {cat}
              </Button>
            ))}
          </Box>

          {/* Divider */}
          <Box
            sx={{
              height: '1px',
              background: 'linear-gradient(90deg, rgba(212,149,42,0.4) 0%, transparent 100%)',
              marginTop: '32px',
            }}
          />
        </Container>
      </Box>

      {/* Projects */}
      <Box sx={{ padding: { xs: '60px 24px', md: '80px 60px' } }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '100px' }}>
            {filtered.map((project, projectIndex) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                viewport={{ once: true, margin: '-80px' }}
              >
                {/* Project Header */}
                <Box sx={{ marginBottom: '40px' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '16px',
                      marginBottom: '12px',
                    }}
                  >
                    <Box>
                      <Typography
                        variant="overline"
                        sx={{
                          color: '#D4952A',
                          fontSize: '0.8rem',
                          letterSpacing: '0.25em',
                          fontWeight: 600,
                          fontFamily: "'Barlow', sans-serif",
                          display: 'block',
                          marginBottom: '8px',
                        }}
                      >
                        {project.category} · {project.location}
                      </Typography>
                      <Typography
                        variant="h3"
                        sx={{
                          fontFamily: "'Playfair Display', serif",
                          fontWeight: 900,
                          color: '#F5EFE0',
                          fontSize: { xs: '2rem', md: '2.75rem' },
                          lineHeight: 1.2,
                        }}
                      >
                        {project.title}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: '48px',
                        height: '3px',
                        background: '#D4952A',
                        marginTop: { xs: '0', md: '16px' },
                        flexShrink: 0,
                        alignSelf: 'center',
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      color: '#E8DFC8',
                      fontSize: '1rem',
                      lineHeight: 1.8,
                      maxWidth: '680px',
                      fontWeight: 300,
                      fontFamily: "'Barlow', sans-serif",
                    }}
                  >
                    {project.description}
                  </Typography>
                </Box>

                {/* Photo Grid */}
                <Grid container spacing={3}>
                  {project.photos.map((photo, photoIndex) => (
                    <Grid
                      size={{ xs: 12, sm: 6 }}
                      key={photoIndex}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: photoIndex * 0.12 }}
                        viewport={{ once: true }}
                      >
                        <Box
                          onClick={() => setLightbox(photo)}
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
                            src={photo.src}
                            alt={photo.alt}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                              transition: 'transform 0.5s ease',
                            }}
                          />
                          {/* Hover Overlay */}
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
                          {/* Photo index badge */}
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
                              {photoIndex + 1} / {project.photos.length}
                            </Typography>
                          </Box>
                        </Box>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>

                {/* Project divider (not last) */}
                {projectIndex < filtered.length - 1 && (
                  <Box
                    sx={{
                      height: '1px',
                      background:
                        'linear-gradient(90deg, transparent 0%, rgba(212,149,42,0.2) 50%, transparent 100%)',
                      marginTop: '100px',
                    }}
                  />
                )}
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <Box sx={{ textAlign: 'center', padding: '80px 0' }}>
                <Typography
                  sx={{
                    color: '#6B6B6B',
                    fontFamily: "'Libre Baskerville', serif",
                    fontSize: '1.1rem',
                    fontStyle: 'italic',
                  }}
                >
                  No projects in this category yet — check back soon.
                </Typography>
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
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

      {/* Lightbox */}
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
              {/* Close button */}
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
                  '&:hover': {
                    background: 'rgba(212,149,42,0.15)',
                    borderColor: '#D4952A',
                  },
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
              <Typography
                sx={{
                  color: 'rgba(245,239,224,0.6)',
                  fontSize: '0.8rem',
                  fontFamily: "'Barlow', sans-serif",
                  marginTop: '12px',
                  fontStyle: 'italic',
                  textAlign: 'center',
                }}
              >
                {lightbox.alt}
              </Typography>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
