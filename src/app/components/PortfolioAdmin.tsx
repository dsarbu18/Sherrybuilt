/**
 * Portfolio Admin — hidden page, not linked in navigation.
 * Access at: https://sheridanbuilt.ca/#/admin
 *
 * Lets you sync Supabase Storage images into portfolio_images
 * without touching any code or pushing to GitHub.
 */

import { useState } from 'react';
import { Box, Container, Typography, Button, Card, CardContent } from '@mui/material';
import { RefreshCw, CheckCircle2, AlertCircle, ImageIcon, SkipForward, Upload } from 'lucide-react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

interface SyncResult {
  found: number;
  inserted: number;
  skipped: number;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export function PortfolioAdmin() {
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<SyncResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSync() {
    setStatus('loading');
    setResult(null);
    setErrorMsg(null);

    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/sync-portfolio-images`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? `Server error ${res.status}`);
      }

      setResult(data as SyncResult);
      setStatus('success');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error');
      setStatus('error');
    }
  }

  return (
    <Box sx={{ background: '#1C1C1C', minHeight: '100vh', padding: { xs: '60px 24px', md: '80px 60px' } }}>
      <Container maxWidth="md">

        {/* Header */}
        <Box sx={{ marginBottom: '48px' }}>
          <Typography
            variant="overline"
            sx={{
              color: '#D4952A',
              fontSize: '0.8rem',
              letterSpacing: '0.3em',
              fontWeight: 600,
              display: 'block',
              marginBottom: '12px',
              fontFamily: "'Barlow', sans-serif",
            }}
          >
            ADMIN · HIDDEN PAGE
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontSize: { xs: '2.5rem', md: '3.2rem' },
              color: '#F5EFE0',
              lineHeight: 1.2,
              marginBottom: '16px',
            }}
          >
            Portfolio{' '}
            <Box component="span" sx={{ color: '#D4952A' }}>
              Admin
            </Box>
          </Typography>
          <Typography
            sx={{
              color: '#E8DFC8',
              fontSize: '1rem',
              lineHeight: 1.8,
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 300,
              maxWidth: '560px',
            }}
          >
            Upload images to Supabase Storage, then click Sync to register them in the portfolio
            database. No GitHub push required.
          </Typography>
        </Box>

        {/* Instructions card */}
        <Card
          sx={{
            background: 'rgba(245, 239, 224, 0.03)',
            border: '1px solid rgba(212, 149, 42, 0.2)',
            borderRadius: 0,
            marginBottom: '40px',
          }}
        >
          <CardContent sx={{ padding: '32px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <Upload size={20} style={{ color: '#D4952A', flexShrink: 0 }} />
              <Typography
                sx={{
                  color: '#F5EFE0',
                  fontFamily: "'Libre Baskerville', serif",
                  fontWeight: 700,
                  fontSize: '1rem',
                }}
              >
                Before syncing — upload your images
              </Typography>
            </Box>
            <Box
              component="ol"
              sx={{
                color: '#E8DFC8',
                fontFamily: "'Barlow', sans-serif",
                fontSize: '0.95rem',
                lineHeight: 2,
                paddingLeft: '20px',
                margin: 0,
              }}
            >
              <li>
                Go to{' '}
                <Box
                  component="a"
                  href={`https://supabase.com/dashboard/project/${projectId}/storage/buckets/portfolio`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: '#D4952A', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                  Supabase Storage → portfolio bucket
                </Box>
              </li>
              <li>
                Upload images into the correct folder:
                <Box
                  component="ul"
                  sx={{ listStyle: 'disc', paddingLeft: '20px', color: '#D4952A', marginTop: '4px' }}
                >
                  {['Exterior', 'Interior', 'Basements', 'Kitchens', 'Bathrooms', 'Decks'].map((f) => (
                    <li key={f}>
                      <Box component="span" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        portfolio/{f}/
                      </Box>
                      <Box component="span" sx={{ color: '#E8DFC8', fontFamily: "'Barlow', sans-serif" }}>
                        {' '}→ category: <strong>{f}</strong>
                      </Box>
                    </li>
                  ))}
                </Box>
              </li>
              <li>Click <strong style={{ color: '#D4952A' }}>Sync Portfolio Images</strong> below.</li>
              <li>Refresh the public portfolio page to see new images.</li>
            </Box>
          </CardContent>
        </Card>

        {/* Sync button */}
        <Box sx={{ marginBottom: '40px' }}>
          <Button
            onClick={handleSync}
            disabled={status === 'loading'}
            startIcon={
              <RefreshCw
                size={18}
                style={{
                  animation: status === 'loading' ? 'spin 1s linear infinite' : 'none',
                }}
              />
            }
            sx={{
              background: status === 'loading' ? 'rgba(212, 149, 42, 0.4)' : '#D4952A',
              color: '#1C1C1C',
              padding: '14px 36px',
              fontSize: '0.9rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              borderRadius: 0,
              fontFamily: "'Barlow', sans-serif",
              transition: 'all 0.3s',
              '&:hover:not(:disabled)': {
                background: '#E8B050',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(212, 149, 42, 0.3)',
              },
              '&:disabled': { cursor: 'not-allowed' },
            }}
          >
            {status === 'loading' ? 'Syncing...' : 'Sync Portfolio Images'}
          </Button>
        </Box>

        {/* Result */}
        {status === 'success' && result && (
          <Card
            sx={{
              background: 'rgba(212, 149, 42, 0.06)',
              border: '1px solid rgba(212, 149, 42, 0.35)',
              borderRadius: 0,
            }}
          >
            <CardContent sx={{ padding: '32px !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <CheckCircle2 size={22} style={{ color: '#D4952A' }} />
                <Typography
                  sx={{
                    color: '#F5EFE0',
                    fontFamily: "'Libre Baskerville', serif",
                    fontWeight: 700,
                    fontSize: '1.1rem',
                  }}
                >
                  Sync complete
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                {[
                  { icon: ImageIcon, label: 'Images found in Storage', value: result.found },
                  { icon: CheckCircle2, label: 'New images inserted', value: result.inserted },
                  { icon: SkipForward, label: 'Already existed (skipped)', value: result.skipped },
                ].map(({ icon: Icon, label, value }) => (
                  <Box key={label} sx={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '140px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Icon size={16} style={{ color: '#D4952A' }} />
                      <Typography
                        sx={{
                          color: '#D4952A',
                          fontSize: '2rem',
                          fontFamily: "'Playfair Display', serif",
                          fontWeight: 900,
                          lineHeight: 1,
                        }}
                      >
                        {value}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        color: '#E8DFC8',
                        fontSize: '0.8rem',
                        fontFamily: "'Barlow', sans-serif",
                        fontWeight: 300,
                        letterSpacing: '0.05em',
                      }}
                    >
                      {label}
                    </Typography>
                  </Box>
                ))}
              </Box>
              {result.inserted > 0 && (
                <Typography
                  sx={{
                    color: '#E8DFC8',
                    fontSize: '0.9rem',
                    fontFamily: "'Barlow', sans-serif",
                    marginTop: '20px',
                    fontStyle: 'italic',
                  }}
                >
                  {result.inserted} new image{result.inserted !== 1 ? 's' : ''} added — refresh the{' '}
                  <Box
                    component="a"
                    href="/#/portfolio"
                    sx={{ color: '#D4952A', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                  >
                    portfolio page
                  </Box>{' '}
                  to see them.
                </Typography>
              )}
              {result.inserted === 0 && (
                <Typography
                  sx={{
                    color: '#6B6B6B',
                    fontSize: '0.9rem',
                    fontFamily: "'Barlow', sans-serif",
                    marginTop: '20px',
                    fontStyle: 'italic',
                  }}
                >
                  No new images to add — everything in Storage is already in the portfolio.
                </Typography>
              )}
            </CardContent>
          </Card>
        )}

        {/* Error */}
        {status === 'error' && errorMsg && (
          <Card
            sx={{
              background: 'rgba(180, 50, 50, 0.08)',
              border: '1px solid rgba(180, 50, 50, 0.3)',
              borderRadius: 0,
            }}
          >
            <CardContent sx={{ padding: '28px !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <AlertCircle size={22} style={{ color: '#E05555', flexShrink: 0, marginTop: '2px' }} />
                <Box>
                  <Typography
                    sx={{
                      color: '#F5EFE0',
                      fontFamily: "'Libre Baskerville', serif",
                      fontWeight: 700,
                      fontSize: '1rem',
                      marginBottom: '8px',
                    }}
                  >
                    Sync failed
                  </Typography>
                  <Typography
                    sx={{
                      color: '#E8DFC8',
                      fontFamily: 'monospace',
                      fontSize: '0.85rem',
                      lineHeight: 1.6,
                    }}
                  >
                    {errorMsg}
                  </Typography>
                  <Typography
                    sx={{
                      color: '#6B6B6B',
                      fontSize: '0.85rem',
                      fontFamily: "'Barlow', sans-serif",
                      marginTop: '12px',
                    }}
                  >
                    Make sure the Edge Function is deployed and the portfolio_images table exists.
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

      </Container>

      {/* Spin animation */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </Box>
  );
}
