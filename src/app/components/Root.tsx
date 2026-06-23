import { Outlet, Link, useLocation } from 'react-router';
import { Container, Button, Box, Typography, Grid } from '@mui/material';
import { Menu as MenuIcon, X } from 'lucide-react';
import { Toaster } from 'sonner';
import { useState } from 'react';

export function Root() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/our-story', label: 'Our Story' },
    { path: '/portfolio', label: 'Portfolio' },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#1C1C1C' }}>
      <Toaster position="top-right" richColors />

      {/* Fixed Navigation */}
      <Box
        component="nav"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: { xs: '12px 24px', md: '18px 60px' },
          background: 'rgba(28, 28, 28, 0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(212, 149, 42, 0.2)',
          transition: 'padding 0.3s',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <Box
            component="img"
            src="/logo.png"
            alt="Sheridan Built Ltd"
            sx={{
              height: { xs: '50px', md: '60px' },
              width: 'auto',
              backgroundColor: '#F5EFE0',
              padding: '4px 8px',
              borderRadius: '4px',
              filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'scale(1.05)',
                backgroundColor: '#FFFFFF',
              },
            }}
          />
        </Link>

        {/* Desktop Navigation */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            gap: '40px',
            alignItems: 'center',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                textDecoration: 'none',
              }}
            >
              <Typography
                sx={{
                  color: location.pathname === link.path ? '#D4952A' : '#F5EFE0',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  transition: 'color 0.2s',
                  fontFamily: "'Barlow', sans-serif",
                  '&:hover': {
                    color: '#D4952A',
                  },
                }}
              >
                {link.label}
              </Typography>
            </Link>
          ))}

          {/* CTA Button */}
          <Link to="/quote" style={{ textDecoration: 'none' }}>
            <Button
              sx={{
                background: '#D4952A',
                color: '#1C1C1C',
                padding: '10px 24px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontSize: '0.8rem',
                fontFamily: "'Barlow', sans-serif",
                transition: 'background 0.2s',
                borderRadius: 0,
                '&:hover': {
                  background: '#E8B050',
                  color: '#1C1C1C',
                },
              }}
            >
              Get A Quote
            </Button>
          </Link>
        </Box>

        {/* Mobile Menu Button */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <Button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            sx={{
              minWidth: 'auto',
              p: 1,
              color: '#F5EFE0',
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </Button>
        </Box>
      </Box>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            zIndex: 99,
            display: { xs: 'block', md: 'none' },
            background: 'rgba(28, 28, 28, 0.98)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(212, 149, 42, 0.2)',
            padding: '20px',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{ textDecoration: 'none', display: 'block' }}
            >
              <Typography
                sx={{
                  color: location.pathname === link.path ? '#D4952A' : '#F5EFE0',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(245, 239, 224, 0.1)',
                  fontFamily: "'Barlow', sans-serif",
                }}
              >
                {link.label}
              </Typography>
            </Link>
          ))}
          <Link
            to="/quote"
            onClick={() => setMobileMenuOpen(false)}
            style={{ textDecoration: 'none', display: 'block', marginTop: '16px' }}
          >
            <Button
              fullWidth
              sx={{
                background: '#D4952A',
                color: '#1C1C1C',
                padding: '12px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontSize: '0.85rem',
                fontFamily: "'Barlow', sans-serif",
                borderRadius: 0,
                '&:hover': {
                  background: '#E8B050',
                },
              }}
            >
              Get A Quote
            </Button>
          </Link>
        </Box>
      )}

      {/* Main Content - add top padding to account for fixed nav */}
      <main className="flex-1" style={{ marginTop: '80px' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        style={{
          background: '#0F0F0F',
          color: '#F5EFE0',
          padding: '60px 0 40px',
          borderTop: '1px solid rgba(212, 149, 42, 0.2)',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} className="mb-8">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 900,
                  marginBottom: '20px',
                  color: '#F5EFE0',
                }}
              >
                SHERIDAN BUILT
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#E8DFC8',
                  maxWidth: '400px',
                  lineHeight: 1.8,
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 300,
                }}
              >
                Crafting exceptional spaces with unmatched precision and dedication. Your vision, our expertise.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Grid container spacing={4}>
                <Grid size={{ xs: 6 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontFamily: "'Libre Baskerville', serif",
                      fontWeight: 700,
                      marginBottom: '16px',
                      color: '#D4952A',
                      fontSize: '0.9rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Services
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {['Kitchen Remodeling', 'Bathroom Renovations', 'Basement Finishing'].map(
                      (service, idx) => (
                        <Typography
                          key={idx}
                          variant="body2"
                          sx={{
                            color: '#E8DFC8',
                            fontFamily: "'Barlow', sans-serif",
                            fontWeight: 300,
                            fontSize: '0.9rem',
                          }}
                        >
                          {service}
                        </Typography>
                      )
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontFamily: "'Libre Baskerville', serif",
                      fontWeight: 700,
                      marginBottom: '16px',
                      color: '#D4952A',
                      fontSize: '0.9rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Company
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Link to="/our-story" style={{ textDecoration: 'none' }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#E8DFC8',
                          fontFamily: "'Barlow', sans-serif",
                          fontWeight: 300,
                          fontSize: '0.9rem',
                          transition: 'color 0.2s',
                          '&:hover': {
                            color: '#D4952A',
                          },
                        }}
                      >
                        Our Story
                      </Typography>
                    </Link>
                    <Link to="/portfolio" style={{ textDecoration: 'none' }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#E8DFC8',
                          fontFamily: "'Barlow', sans-serif",
                          fontWeight: 300,
                          fontSize: '0.9rem',
                          transition: 'color 0.2s',
                          '&:hover': {
                            color: '#D4952A',
                          },
                        }}
                      >
                        Portfolio
                      </Typography>
                    </Link>
                    <Link to="/quote" style={{ textDecoration: 'none' }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#E8DFC8',
                          fontFamily: "'Barlow', sans-serif",
                          fontWeight: 300,
                          fontSize: '0.9rem',
                          transition: 'color 0.2s',
                          '&:hover': {
                            color: '#D4952A',
                          },
                        }}
                      >
                        Get Quote
                      </Typography>
                    </Link>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box
            sx={{
              borderTop: '1px solid rgba(212, 149, 42, 0.15)',
              paddingTop: '32px',
              marginTop: '32px',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                color: '#6B6B6B',
                fontFamily: "'Barlow', sans-serif",
                fontSize: '0.85rem',
                letterSpacing: '0.05em',
              }}
            >
              © {new Date().getFullYear()} Sheridan Built Ltd. All rights reserved. Licensed & Insured General
              Contractor.
            </Typography>
          </Box>
        </Container>
      </footer>
    </div>
  );
}
