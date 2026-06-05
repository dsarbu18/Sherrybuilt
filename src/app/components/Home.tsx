import { useState } from 'react';
import { Button, TextField, Container, Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { ArrowRight, CheckCircle2, Star, MapPin, Award, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

export function Home() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const services = [
    {
      id: 'kitchen',
      title: 'Kitchen Remodeling',
      description: 'Transform your kitchen into a stunning culinary sanctuary with custom cabinetry, premium finishes, and thoughtful design.',
      features: ['Custom Cabinetry', 'Premium Countertops', 'Designer Fixtures', 'Smart Layouts'],
    },
    {
      id: 'bathroom',
      title: 'Bathroom Renovations',
      description: 'Create your private spa retreat with luxury fixtures, elegant tile work, and sophisticated design elements.',
      features: ['Luxury Fixtures', 'Italian Tile', 'Walk-in Showers', 'Custom Vanities'],
    },
    {
      id: 'basement',
      title: 'Basement Finishing',
      description: 'Unlock hidden potential with custom designs, superior insulation, and exquisite finishes for year-round comfort.',
      features: ['Waterproofing', 'Custom Layouts', 'Ambient Lighting', 'Entertainment Spaces'],
    },
  ];

  const reviews = [
    {
      id: 'review-martinez',
      name: 'Sarah & Tom Martinez',
      rating: 5,
      text: 'The craftsmanship exceeded every expectation. Our kitchen is now the heart of our home—elegant, functional, and absolutely stunning.',
      project: 'Kitchen Remodeling',
      location: 'Toronto, ON',
    },
    {
      id: 'review-clark',
      name: 'Jennifer Clark',
      rating: 5,
      text: 'From concept to completion, the team delivered unparalleled professionalism. Our master bathroom is pure luxury.',
      project: 'Bathroom Renovation',
      location: 'Mississauga, ON',
    },
    {
      id: 'review-wong',
      name: 'David & Lisa Wong',
      rating: 5,
      text: 'Exceptional quality and attention to detail. Our basement finishing was completed on time and on budget. Outstanding work.',
      project: 'Basement Finishing',
      location: 'Oakville, ON',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-50e10fae/quotes`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned an invalid response. Please try again.');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit quote request');
      }

      toast.success('Quote request submitted successfully! We\'ll contact you within 24 hours.');
      setFormData({ name: '', email: '', phone: '', projectType: '', message: '' });
    } catch (error) {
      console.error('Quote submission error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ background: '#1C1C1C', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: '#1C1C1C',
          padding: { xs: '0 24px', md: '0 60px' },
        }}
      >
        {/* Background */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(212, 149, 42, 0.03) 0%, rgba(28, 28, 28, 0.95) 50%, rgba(28, 28, 28, 1) 100%)',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(212, 149, 42, 0.08) 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            },
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <Typography
              variant="overline"
              sx={{
                color: '#D4952A',
                fontSize: '0.85rem',
                letterSpacing: '0.25em',
                fontWeight: 600,
                marginBottom: '32px',
                display: 'block',
                fontFamily: "'Barlow', sans-serif",
              }}
            >
              TORONTO, ONTARIO • EST. 2025
            </Typography>
            <Typography
              variant="h1"
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                fontSize: { xs: '3rem', md: '5.5rem' },
                color: '#F5EFE0',
                marginBottom: '32px',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              Built With <Box component="span" sx={{ color: '#D4952A' }}>Pride</Box>, Finished With Precision.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#E8DFC8',
                fontSize: { xs: '1rem', md: '1.15rem' },
                lineHeight: 1.8,
                marginBottom: '32px',
                maxWidth: '700px',
                fontWeight: 300,
                fontStyle: 'italic',
              }}
            >
              Professional carpentry & contracting for Toronto homeowners. Custom trim, millwork, kitchens, and renovations — done right the first time.
            </Typography>
            <Typography
              variant="overline"
              sx={{
                color: '#D4952A',
                fontSize: '0.85rem',
                letterSpacing: '0.25em',
                fontWeight: 600,
                marginBottom: '48px',
                display: 'block',
                fontFamily: "'Barlow', sans-serif",
              }}
            >
              SHERIDAN BUILT — ALWAYS ON TIME
            </Typography>
            <Box sx={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <Button
                onClick={() => navigate('/quote')}
                sx={{
                  background: '#D4952A',
                  color: '#1C1C1C',
                  padding: '16px 40px',
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
                endIcon={<ArrowRight />}
              >
                Request Consultation
              </Button>
              <Button
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                sx={{
                  background: 'transparent',
                  color: '#F5EFE0',
                  padding: '16px 40px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  border: '1px solid rgba(212, 149, 42, 0.4)',
                  borderRadius: 0,
                  fontFamily: "'Barlow', sans-serif",
                  transition: 'all 0.3s',
                  '&:hover': {
                    background: 'rgba(212, 149, 42, 0.1)',
                    borderColor: '#D4952A',
                  },
                }}
              >
                Explore Services
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Services Section */}
      <Box
        id="services"
        sx={{
          padding: { xs: '80px 24px', md: '120px 60px' },
          background: 'linear-gradient(180deg, #1C1C1C 0%, #0F0F0F 100%)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', marginBottom: '80px' }}>
            <Typography
              variant="overline"
              sx={{
                color: '#D4952A',
                fontSize: '0.85rem',
                letterSpacing: '0.3em',
                fontWeight: 600,
                marginBottom: '16px',
                display: 'block',
              }}
            >
              OUR EXPERTISE
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
              Signature Services
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#E8DFC8',
                fontSize: '1.1rem',
                maxWidth: '700px',
                margin: '0 auto',
                lineHeight: 1.8,
                fontWeight: 300,
              }}
            >
              Transforming spaces with meticulous attention to detail and an unwavering commitment to excellence.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={service.id}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  viewport={{ once: true }}
                  style={{ height: '100%' }}
                >
                  <Card
                    sx={{
                      background: 'rgba(28, 28, 28, 0.6)',
                      border: '1px solid rgba(212, 149, 42, 0.2)',
                      borderRadius: 0,
                      overflow: 'hidden',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.4s',
                      '&:hover': {
                        borderColor: '#D4952A',
                        transform: 'translateY(-8px)',
                        boxShadow: '0 16px 48px rgba(212, 149, 42, 0.15)',
                      },
                    }}
                  >
                    <CardContent sx={{ padding: '40px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      {/* Gold accent bar */}
                      <Box sx={{ width: '48px', height: '3px', background: '#D4952A', marginBottom: '28px' }} />
                      <Typography
                        variant="h4"
                        sx={{
                          fontFamily: "'Playfair Display', serif",
                          fontWeight: 900,
                          color: '#F5EFE0',
                          fontSize: { xs: '1.6rem', md: '1.75rem' },
                          marginBottom: '16px',
                          lineHeight: 1.2,
                        }}
                      >
                        {service.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#E8DFC8',
                          marginBottom: '28px',
                          lineHeight: 1.8,
                          fontWeight: 300,
                        }}
                      >
                        {service.description}
                      </Typography>
                      <Grid container spacing={2} sx={{ marginBottom: '32px', flexGrow: 1 }}>
                        {service.features.map((feature, idx) => (
                          <Grid size={{ xs: 6 }} key={idx}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <CheckCircle2 size={16} style={{ color: '#D4952A', flexShrink: 0 }} />
                              <Typography
                                variant="body2"
                                sx={{ color: '#E8DFC8', fontSize: '0.9rem', fontWeight: 400 }}
                              >
                                {feature}
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                      <Button
                        onClick={() => navigate('/quote')}
                        fullWidth
                        sx={{
                          background: 'transparent',
                          color: '#D4952A',
                          border: '1px solid rgba(212, 149, 42, 0.4)',
                          padding: '12px',
                          fontWeight: 600,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          fontSize: '0.85rem',
                          borderRadius: 0,
                          transition: 'all 0.3s',
                          '&:hover': {
                            background: '#D4952A',
                            color: '#1C1C1C',
                            borderColor: '#D4952A',
                          },
                        }}
                        endIcon={<ArrowRight size={18} />}
                      >
                        Inquire
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Reviews Section */}
      <Box
        sx={{
          padding: { xs: '80px 24px', md: '120px 60px' },
          background: '#1C1C1C',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(212, 149, 42, 0.3) 50%, transparent 100%)',
          },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', marginBottom: '80px' }}>
            <Typography
              variant="overline"
              sx={{
                color: '#D4952A',
                fontSize: '0.85rem',
                letterSpacing: '0.3em',
                fontWeight: 600,
                marginBottom: '16px',
                display: 'block',
              }}
            >
              CLIENT TESTIMONIALS
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
              Excellence Recognized
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#E8DFC8',
                fontSize: '1.1rem',
                maxWidth: '700px',
                margin: '0 auto',
                lineHeight: 1.8,
                fontWeight: 300,
              }}
            >
              Discover why discerning clients choose Sheridan Built for their most important projects.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {reviews.map((review, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={review.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Card
                    sx={{
                      background: 'rgba(28, 28, 28, 0.4)',
                      border: '1px solid rgba(212, 149, 42, 0.15)',
                      borderRadius: 0,
                      padding: '32px',
                      height: '100%',
                      transition: 'all 0.4s',
                      '&:hover': {
                        borderColor: '#D4952A',
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 32px rgba(212, 149, 42, 0.15)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} style={{ color: '#D4952A', fill: '#D4952A' }} />
                      ))}
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#E8DFC8',
                        marginBottom: '24px',
                        fontStyle: 'italic',
                        lineHeight: 1.8,
                        fontWeight: 300,
                        fontSize: '1rem',
                      }}
                    >
                      "{review.text}"
                    </Typography>
                    <Box sx={{ borderTop: '1px solid rgba(212, 149, 42, 0.2)', paddingTop: '20px' }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: "'Libre Baskerville', serif",
                          fontWeight: 700,
                          color: '#F5EFE0',
                          marginBottom: '8px',
                          fontSize: '1rem',
                        }}
                      >
                        {review.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#D4952A',
                          fontWeight: 600,
                          marginBottom: '4px',
                          fontSize: '0.85rem',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {review.project}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={14} style={{ color: '#6B6B6B' }} />
                        <Typography variant="caption" sx={{ color: '#6B6B6B', fontSize: '0.8rem' }}>
                          {review.location}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Quote Form Section */}
      <Box
        sx={{
          padding: { xs: '80px 24px', md: '120px 60px' },
          background: 'linear-gradient(180deg, #1C1C1C 0%, #0F0F0F 100%)',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid size={{ xs: 12, md: 5 }}>
              <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <Typography
                  variant="overline"
                  sx={{
                    color: '#D4952A',
                    fontSize: '0.85rem',
                    letterSpacing: '0.3em',
                    fontWeight: 600,
                    marginBottom: '16px',
                    display: 'block',
                  }}
                >
                  START YOUR PROJECT
                </Typography>
                <Typography
                  variant="h2"
                  sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 900,
                    fontSize: { xs: '2.5rem', md: '3.2rem' },
                    color: '#F5EFE0',
                    marginBottom: '24px',
                    lineHeight: 1.2,
                  }}
                >
                  Let's Create Something Exceptional
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#E8DFC8',
                    fontSize: '1.05rem',
                    marginBottom: '40px',
                    lineHeight: 1.8,
                    fontWeight: 300,
                  }}
                >
                  Share your vision with us. Receive a detailed, transparent consultation within 24 hours.
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {[
                    { icon: Clock, title: '24-Hour Response', description: 'Swift, professional communication' },
                    { icon: Award, title: 'Transparent Pricing', description: 'Detailed estimates, no surprises' },
                    { icon: CheckCircle2, title: 'Expert Consultation', description: 'Complimentary design guidance' },
                  ].map((benefit, idx) => (
                    <Box key={idx} sx={{ display: 'flex', gap: '16px' }}>
                      <Box
                        sx={{
                          width: '48px',
                          height: '48px',
                          borderRadius: 0,
                          background: 'rgba(212, 149, 42, 0.1)',
                          border: '1px solid rgba(212, 149, 42, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <benefit.icon size={22} style={{ color: '#D4952A' }} />
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: "'Libre Baskerville', serif",
                            fontWeight: 700,
                            color: '#F5EFE0',
                            marginBottom: '4px',
                            fontSize: '1rem',
                          }}
                        >
                          {benefit.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#E8DFC8', fontWeight: 300 }}>
                          {benefit.description}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Card
                  sx={{
                    background: 'rgba(28, 28, 28, 0.8)',
                    border: '1px solid rgba(212, 149, 42, 0.3)',
                    borderRadius: 0,
                    padding: { xs: '32px', md: '48px' },
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 900,
                      color: '#F5EFE0',
                      marginBottom: '32px',
                      fontSize: '1.8rem',
                    }}
                  >
                    Request Consultation
                  </Typography>
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          variant="filled"
                          sx={{
                            '& .MuiFilledInput-root': {
                              background: 'rgba(245, 239, 224, 0.05)',
                              border: '1px solid rgba(212, 149, 42, 0.2)',
                              borderRadius: 0,
                              '&:hover': {
                                background: 'rgba(245, 239, 224, 0.08)',
                                borderColor: 'rgba(212, 149, 42, 0.4)',
                              },
                              '&.Mui-focused': {
                                background: 'rgba(245, 239, 224, 0.08)',
                                borderColor: '#D4952A',
                              },
                            },
                            '& .MuiInputLabel-root': { color: '#E8DFC8' },
                            '& .MuiFilledInput-input': { color: '#F5EFE0' },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          variant="filled"
                          sx={{
                            '& .MuiFilledInput-root': {
                              background: 'rgba(245, 239, 224, 0.05)',
                              border: '1px solid rgba(212, 149, 42, 0.2)',
                              borderRadius: 0,
                              '&:hover': {
                                background: 'rgba(245, 239, 224, 0.08)',
                                borderColor: 'rgba(212, 149, 42, 0.4)',
                              },
                              '&.Mui-focused': {
                                background: 'rgba(245, 239, 224, 0.08)',
                                borderColor: '#D4952A',
                              },
                            },
                            '& .MuiInputLabel-root': { color: '#E8DFC8' },
                            '& .MuiFilledInput-input': { color: '#F5EFE0' },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          variant="filled"
                          sx={{
                            '& .MuiFilledInput-root': {
                              background: 'rgba(245, 239, 224, 0.05)',
                              border: '1px solid rgba(212, 149, 42, 0.2)',
                              borderRadius: 0,
                              '&:hover': {
                                background: 'rgba(245, 239, 224, 0.08)',
                                borderColor: 'rgba(212, 149, 42, 0.4)',
                              },
                              '&.Mui-focused': {
                                background: 'rgba(245, 239, 224, 0.08)',
                                borderColor: '#D4952A',
                              },
                            },
                            '& .MuiInputLabel-root': { color: '#E8DFC8' },
                            '& .MuiFilledInput-input': { color: '#F5EFE0' },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Project Type"
                          name="projectType"
                          value={formData.projectType}
                          onChange={handleChange}
                          placeholder="Kitchen, Bathroom, Addition..."
                          required
                          variant="filled"
                          sx={{
                            '& .MuiFilledInput-root': {
                              background: 'rgba(245, 239, 224, 0.05)',
                              border: '1px solid rgba(212, 149, 42, 0.2)',
                              borderRadius: 0,
                              '&:hover': {
                                background: 'rgba(245, 239, 224, 0.08)',
                                borderColor: 'rgba(212, 149, 42, 0.4)',
                              },
                              '&.Mui-focused': {
                                background: 'rgba(245, 239, 224, 0.08)',
                                borderColor: '#D4952A',
                              },
                            },
                            '& .MuiInputLabel-root': { color: '#E8DFC8' },
                            '& .MuiFilledInput-input': { color: '#F5EFE0' },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Project Details"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          multiline
                          rows={5}
                          placeholder="Share your vision, timeline, and any specific requirements..."
                          required
                          variant="filled"
                          sx={{
                            '& .MuiFilledInput-root': {
                              background: 'rgba(245, 239, 224, 0.05)',
                              border: '1px solid rgba(212, 149, 42, 0.2)',
                              borderRadius: 0,
                              '&:hover': {
                                background: 'rgba(245, 239, 224, 0.08)',
                                borderColor: 'rgba(212, 149, 42, 0.4)',
                              },
                              '&.Mui-focused': {
                                background: 'rgba(245, 239, 224, 0.08)',
                                borderColor: '#D4952A',
                              },
                            },
                            '& .MuiInputLabel-root': { color: '#E8DFC8' },
                            '& .MuiFilledInput-input': { color: '#F5EFE0' },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Button
                          type="submit"
                          fullWidth
                          disabled={isSubmitting}
                          endIcon={<ArrowRight />}
                          sx={{
                            background: '#D4952A',
                            color: '#1C1C1C',
                            padding: '16px',
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            borderRadius: 0,
                            transition: 'all 0.3s',
                            '&:hover': {
                              background: '#E8B050',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 24px rgba(212, 149, 42, 0.3)',
                            },
                            '&:disabled': {
                              background: 'rgba(212, 149, 42, 0.3)',
                              color: 'rgba(28, 28, 28, 0.5)',
                            },
                          }}
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit Request'}
                        </Button>
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            textAlign: 'center',
                            color: '#6B6B6B',
                            marginTop: '12px',
                            fontSize: '0.8rem',
                          }}
                        >
                          We respect your privacy. Your information is secure.
                        </Typography>
                      </Grid>
                    </Grid>
                  </form>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

    </Box>
  );
}
