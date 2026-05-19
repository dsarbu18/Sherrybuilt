import { Container, Box, Typography, Grid } from '@mui/material';
import { motion } from 'motion/react';
import { Building2, Calendar, MapPin } from 'lucide-react';
import historicalImage from '../../imports/image-3.png';

export function OurStory() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1C1C1C' }}>
      {/* Hero Section */}
      <section className="py-20" style={{
        background: 'linear-gradient(135deg, rgba(28, 28, 28, 0.98) 0%, rgba(40, 40, 40, 0.95) 100%)',
        borderBottom: '1px solid rgba(212, 149, 42, 0.2)'
      }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Box className="flex justify-center mb-6">
              <Building2 size={64} strokeWidth={1.5} style={{ color: '#D4952A' }} />
            </Box>
            <Typography
              variant="h2"
              className="font-bold mb-4"
              sx={{
                fontFamily: '"Playfair Display", serif',
                color: '#F5EFE0',
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              Our Story
            </Typography>
            <Typography
              variant="h6"
              className="font-light max-w-3xl mx-auto"
              sx={{
                fontFamily: '"Libre Baskerville", serif',
                fontStyle: 'italic',
                color: 'rgba(245, 239, 224, 0.85)',
                fontSize: { xs: '1rem', md: '1.2rem' },
                letterSpacing: '0.5px'
              }}
            >
              A Legacy of Craftsmanship Spanning Generations
            </Typography>
          </motion.div>
        </Container>
      </section>

      {/* Historical Timeline Section */}
      <section className="py-20">
        <Container maxWidth="lg">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-16"
          >
            <Typography
              variant="overline"
              sx={{
                fontFamily: '"Barlow", sans-serif',
                color: '#D4952A',
                fontSize: '0.95rem',
                letterSpacing: '3px',
                fontWeight: 600
              }}
            >
              WHERE IT ALL BEGAN
            </Typography>
            <Typography
              variant="h3"
              className="font-bold mt-3"
              sx={{
                fontFamily: '"Playfair Display", serif',
                color: '#F5EFE0',
                fontSize: { xs: '2rem', md: '2.75rem' }
              }}
            >
              Our Heritage
            </Typography>
          </motion.div>

          {/* Historical Content Grid */}
          <Grid container spacing={6} alignItems="center">
            {/* Historical Image */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '8px',
                    border: '2px solid rgba(212, 149, 42, 0.3)',
                    boxShadow: '0 8px 32px rgba(212, 149, 42, 0.15)'
                  }}
                >
                  <img
                    src={historicalImage}
                    alt="Sheridan Equipment Ltd. 1945-1946"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      filter: 'grayscale(100%) contrast(1.1) brightness(0.95)'
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(to top, rgba(28, 28, 28, 0.95), transparent)',
                      padding: '24px',
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: '"Libre Baskerville", serif',
                        color: '#F5EFE0',
                        fontSize: '0.9rem',
                        fontStyle: 'italic'
                      }}
                    >
                      Sheridan Equipment Ltd., 33 Laird Drive
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: '"Barlow", sans-serif',
                        color: '#D4952A',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        letterSpacing: '1px',
                        marginTop: '4px'
                      }}
                    >
                      1945 - 1946
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>

            {/* Historical Text */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Box
                  sx={{
                    backgroundColor: 'rgba(245, 239, 224, 0.03)',
                    border: '1px solid rgba(212, 149, 42, 0.2)',
                    borderRadius: '8px',
                    padding: { xs: '32px', md: '40px' }
                  }}
                >
                  {/* Timeline Marker */}
                  <Box className="flex items-center gap-3 mb-6">
                    <Calendar size={28} style={{ color: '#D4952A' }} />
                    <Typography
                      sx={{
                        fontFamily: '"Playfair Display", serif',
                        color: '#D4952A',
                        fontSize: { xs: '1.5rem', md: '1.75rem' },
                        fontWeight: 700
                      }}
                    >
                      1945 - 1946
                    </Typography>
                  </Box>

                  <Typography
                    variant="h5"
                    className="mb-4"
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      color: '#F5EFE0',
                      fontSize: { xs: '1.5rem', md: '1.75rem' },
                      fontWeight: 600,
                      lineHeight: 1.4
                    }}
                  >
                    Sheridan Equipment Ltd.
                  </Typography>

                  <Box className="flex items-start gap-2 mb-5">
                    <MapPin size={18} style={{ color: '#D4952A', marginTop: '4px', flexShrink: 0 }} />
                    <Typography
                      sx={{
                        fontFamily: '"Barlow", sans-serif',
                        color: 'rgba(245, 239, 224, 0.8)',
                        fontSize: '1rem',
                        fontWeight: 500
                      }}
                    >
                      33 Laird Drive, Toronto
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      fontFamily: '"Barlow", sans-serif',
                      color: '#F5EFE0',
                      fontSize: '1.05rem',
                      lineHeight: 1.8,
                      marginBottom: '16px'
                    }}
                  >
                    In the post-war era of 1945, Sheridan Equipment Ltd. established its roots at 33 Laird Drive in Toronto. During a time when the city was experiencing unprecedented growth and development, the company quickly became known for its commitment to precision engineering and superior craftsmanship.
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: '"Barlow", sans-serif',
                      color: '#F5EFE0',
                      fontSize: '1.05rem',
                      lineHeight: 1.8,
                      marginBottom: '16px'
                    }}
                  >
                    Operating from this iconic facility, Sheridan Equipment Ltd. played a vital role in Toronto's industrial landscape, serving the construction and manufacturing sectors with innovative solutions and unwavering reliability.
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: '"Barlow", sans-serif',
                      color: '#F5EFE0',
                      fontSize: '1.05rem',
                      lineHeight: 1.8
                    }}
                  >
                    The values established during these formative years—dedication to quality, attention to detail, and pride in workmanship—continue to define our approach to construction and renovation today.
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Modern Day Section - Placeholder */}
      <section className="py-20" style={{
        backgroundColor: 'rgba(245, 239, 224, 0.02)',
        borderTop: '1px solid rgba(212, 149, 42, 0.2)',
        borderBottom: '1px solid rgba(212, 149, 42, 0.2)'
      }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <Typography
              variant="overline"
              sx={{
                fontFamily: '"Barlow", sans-serif',
                color: '#D4952A',
                fontSize: '0.95rem',
                letterSpacing: '3px',
                fontWeight: 600
              }}
            >
              TODAY
            </Typography>
            <Typography
              variant="h3"
              className="font-bold mt-3 mb-6"
              sx={{
                fontFamily: '"Playfair Display", serif',
                color: '#F5EFE0',
                fontSize: { xs: '2rem', md: '2.75rem' }
              }}
            >
              Sheridan Built Ltd.
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Barlow", sans-serif',
                color: 'rgba(245, 239, 224, 0.7)',
                fontSize: '1.1rem',
                fontStyle: 'italic',
                maxWidth: '700px',
                margin: '0 auto'
              }}
            >
              Current story content will be added here...
            </Typography>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
