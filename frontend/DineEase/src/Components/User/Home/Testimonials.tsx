import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
// import { useTheme } from '@mui/system';

const userTestimonials = [
    {
        avatar: <Avatar alt="Remy Sharp" src="" />,
        name: 'Remy Sharp',
        // occupation: 'Senior Engineer',
        testimonial:
            "I love the diverse cuisine options on DineEase. There's always something new and delicious to try! Whether I'm in the mood for Italian, Chinese, or something exotic, DineEase never disappoints. The variety keeps my taste buds excited and my meal times interesting.",
    },
    {
        avatar: <Avatar alt="Travis Howard" src="" />,
        name: 'Travis Howard',
        // occupation: 'Lead Product Designer',
        testimonial:
            "The real-time order tracking is fantastic. I always know exactly when my food will arrive, and it's always on time! It gives me peace of mind to see my order’s progress, and I appreciate the accuracy and reliability of their delivery service.",
    },
    {
        avatar: <Avatar alt="Cindy Baker" src="" />,
        name: 'Cindy Baker',
        occupation: 'CTO',
        testimonial:
            'Fast delivery and fresh food every time. DineEase has become my go-to for dinner! The quality of the food is consistently high, and I love that I can get a hot meal quickly after a long day at work. It’s convenience and quality rolled into one.',
    },
    {
        avatar: <Avatar alt="Remy Sharp" src="" />,
        name: 'Julia Stewart',
        // occupation: 'Senior Engineer',
        testimonial:
            "The easy payment options make checkout a breeze. I can use my preferred method without any hassle. Whether I’m using my credit card, a digital wallet, or paying cash on delivery, the process is seamless and secure. It makes the whole experience stress-free.",
    },
    {
        avatar: <Avatar alt="Travis Howard" src="" />,
        name: 'John Smith',
        // occupation: 'Product Designer',
        testimonial:
            "DineEase's user-friendly app makes browsing and ordering food a delightful experience. Highly recommended! The interface is clean and intuitive, making it easy to find what I’m looking for. I appreciate the attention to detail and how effortless it is to place an order",
    },
    {
        avatar: <Avatar alt="Cindy Baker" src="" />,
        name: 'Daniel Wolf',
        // occupation: 'CDO',
        testimonial:
            "DineEase has completely transformed my dining experience. The convenience of ordering my favorite meals with just a few taps is unmatched. The app is so easy to use, and the variety of restaurants available means I can always find something to satisfy my cravings. Plus, the food is always delivered fresh and on time.",
    },
];

// const whiteLogos = [
//     'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560628e8573c43893fe0ace_Sydney-white.svg',
//     'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f4d520d0517ae8e8ddf13_Bern-white.svg',
//     'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f46794c159024c1af6d44_Montreal-white.svg',
//     'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e891fa22f89efd7477a_TerraLight.svg',
//     'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560a09d1f6337b1dfed14ab_colorado-white.svg',
//     'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f5caa77bf7d69fb78792e_Ankara-white.svg',
// ];

// const darkLogos = [
//     'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560628889c3bdf1129952dc_Sydney-black.svg',
//     'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f4d4d8b829a89976a419c_Bern-black.svg',
//     'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f467502f091ccb929529d_Montreal-black.svg',
//     'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e911fa22f2203d7514c_TerraDark.svg',
//     'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560a0990f3717787fd49245_colorado-black.svg',
//     'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f5ca4e548b0deb1041c33_Ankara-black.svg',
// ];

// const logoStyle = {
//     width: '64px',
//     opacity: 0.3,
// };

export default function Testimonials() {
    // const theme = useTheme();
    // const logos = theme.palette.mode === 'light' ? darkLogos : whiteLogos;

    return (
        <Container
            id="testimonials"
            sx={{
                pt: { xs: 4, sm: 12 },
                pb: { xs: 8, sm: 16 },
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: { xs: 3, sm: 6 },
            }}
        >
            <Box
                sx={{
                    width: { sm: '100%', md: '60%' },
                    textAlign: { sm: 'left', md: 'center' },
                }}
            >
                <Typography component="h2" variant="h4" color="text.primary">
                    Here's What Our Customers Are Saying
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    At DineEase, we take pride in delivering exceptional service and delicious meals to our customers. But don't just take our word for it—read what our satisfied customers have to say about their experiences. From fast delivery to diverse cuisine options, discover why DineEase is the preferred choice for food lovers everywhere.
                </Typography>
            </Box>
            <Grid container spacing={2}>
                {userTestimonials.map((testimonial, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex' }}>
                        <Card
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                flexGrow: 1,
                                p: 1,
                            }}
                        >
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    {testimonial.testimonial}
                                </Typography>
                            </CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    pr: 2,
                                }}
                            >
                                <CardHeader
                                    avatar={testimonial.avatar}
                                    title={testimonial.name}
                                    subheader={testimonial.occupation}
                                />
                                {/* <img
                                    src={logos[index]}
                                    alt={`Logo ${index + 1}`}
                                    style={logoStyle}
                                /> */}
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}