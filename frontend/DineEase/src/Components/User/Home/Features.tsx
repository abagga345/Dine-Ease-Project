import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import EdgesensorHighRoundedIcon from '@mui/icons-material/EdgesensorHighRounded';
import ViewQuiltRoundedIcon from '@mui/icons-material/ViewQuiltRounded';

const items = [
    {
        icon: <ViewQuiltRoundedIcon />,
        title: 'Diverse Cuisine Options',
        description:
            'Explore a world of flavors with our extensive selection of cuisines.',
        imageLight: 'url("https://img.freepik.com/free-photo/top-view-meals-tasty-yummy-different-pastries-dishes-brown-surface_140725-14554.jpg")',
        imageDark: 'url("https://img.freepik.com/free-photo/top-view-meals-tasty-yummy-different-pastries-dishes-brown-surface_140725-14554.jpg")',
    },
    {
        icon: <EdgesensorHighRoundedIcon />,
        title: 'Quick and Easy Ordering',
        description:
            'Streamline your meal planning with our intuitive ordering system. Browse menus, customize your dishes, and place your order in just a few clicks.',
        imageLight: 'url("https://i.pinimg.com/564x/9d/70/21/9d70212c6e1b32e0d2ee1ac37274f6d2.jpg")',
        imageDark: 'url("https://i.pinimg.com/564x/9d/70/21/9d70212c6e1b32e0d2ee1ac37274f6d2.jpg")',
    },
    {
        icon: <DevicesRoundedIcon />,
        title: 'Fast Delivery',
        description:
            'Enjoy your favorite meals delivered hot and fresh to your doorstep. Our fast delivery service ensures your food arrives just the way you like it.',
        imageLight: 'url("https://i.pinimg.com/originals/06/a1/f8/06a1f8e1c6d33fc7616c91a152b06629.jpg")',
        imageDark: 'url("https://i.pinimg.com/originals/06/a1/f8/06a1f8e1c6d33fc7616c91a152b06629.jpg")',
    },
];

export default function Features() {
    const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);

    const handleItemClick = (index: number) => {
        setSelectedItemIndex(index);
    };

    const selectedFeature = items[selectedItemIndex];

    return (
        <Container id="features" sx={{ py: { xs: 8, sm: 16 } }}>
            <Grid container spacing={6}>
                <Grid item xs={12} md={6}>
                    <div>
                        <Typography component="h2" variant="h4" color="text.primary">
                            Why chose DineEase?
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ my: { xs: 2, sm: 4 } }}
                        >
                            Experience the ultimate convenience in food ordering with DineEase. We offer a range of features designed to make your dining experience effortless and enjoyable. Discover how DineEase stands out with personalized recommendations, fast delivery, and a diverse selection of cuisines.
                        </Typography>
                    </div>
                    <Grid container item gap={1} sx={{ display: { xs: 'auto', sm: 'none' } }}>
                        {items.map(({ title }, index) => (
                            <Chip
                                key={index}
                                label={title}
                                onClick={() => handleItemClick(index)}
                                sx={{
                                    borderColor: (theme) => {
                                        if (theme.palette.mode === 'light') {
                                            return selectedItemIndex === index ? 'primary.light' : '';
                                        }
                                        return selectedItemIndex === index ? 'primary.light' : '';
                                    },
                                    background: (theme) => {
                                        if (theme.palette.mode === 'light') {
                                            return selectedItemIndex === index ? 'none' : '';
                                        }
                                        return selectedItemIndex === index ? 'none' : '';
                                    },
                                    backgroundColor: selectedItemIndex === index ? 'primary.main' : '',
                                    '& .MuiChip-label': {
                                        color: selectedItemIndex === index ? '#fff' : '',
                                    },
                                }}
                            />
                        ))}
                    </Grid>
                    <Box
                        component={Card}
                        variant="outlined"
                        sx={{
                            display: { xs: 'auto', sm: 'none' },
                            mt: 4,
                        }}
                    >
                        <Box
                            sx={{
                                backgroundImage: (theme) =>
                                    theme.palette.mode === 'light'
                                        ? items[selectedItemIndex].imageLight
                                        : items[selectedItemIndex].imageDark,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                minHeight: 280,
                            }}
                        />
                        <Box sx={{ px: 2, pb: 2 }}>
                            <Typography color="text.primary" variant="body2" fontWeight="bold">
                                {selectedFeature.title}
                            </Typography>
                            <Typography color="text.secondary" variant="body2" sx={{ my: 0.5 }}>
                                {selectedFeature.description}
                            </Typography>
                            <Link
                                color="primary"
                                variant="body2"
                                fontWeight="bold"
                                sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    '& > svg': { transition: '0.2s' },
                                    '&:hover > svg': { transform: 'translateX(2px)' },
                                }}
                            >
                                <ChevronRightRoundedIcon
                                    fontSize="small"
                                    sx={{ mt: '1px', ml: '2px' }}
                                />
                            </Link>
                        </Box>
                    </Box>
                    <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="flex-start"
                        spacing={2}
                        useFlexGap
                        sx={{ width: '100%', display: { xs: 'none', sm: 'flex' } }}
                    >
                        {items.map(({ icon, title, description }, index) => (
                            <Card
                                key={index}
                                variant="outlined"
                                component={Button}
                                onClick={() => handleItemClick(index)}
                                sx={{
                                    p: 3,
                                    height: 'fit-content',
                                    width: '100%',
                                    background: 'none',
                                    backgroundColor:
                                        selectedItemIndex === index ? 'action.selected' : undefined,
                                    borderColor: (theme) => {
                                        if (theme.palette.mode === 'light') {
                                            return selectedItemIndex === index
                                                ? 'primary.light'
                                                : 'grey.200';
                                        }
                                        return selectedItemIndex === index ? 'primary.dark' : 'grey.800';
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: '100%',
                                        display: 'flex',
                                        textAlign: 'left',
                                        flexDirection: { xs: 'column', md: 'row' },
                                        alignItems: { md: 'center' },
                                        gap: 2.5,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            color: (theme) => {
                                                if (theme.palette.mode === 'light') {
                                                    return selectedItemIndex === index
                                                        ? 'primary.main'
                                                        : 'grey.300';
                                                }
                                                return selectedItemIndex === index
                                                    ? 'primary.main'
                                                    : 'grey.700';
                                            },
                                        }}
                                    >
                                        {icon}
                                    </Box>
                                    <Box sx={{ textTransform: 'none' }}>
                                        <Typography
                                            color="text.primary"
                                            variant="body2"
                                            fontWeight="bold"
                                        >
                                            {title}
                                        </Typography>
                                        <Typography
                                            color="text.secondary"
                                            variant="body2"
                                            sx={{ my: 0.5 }}
                                        >
                                            {description}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Card>
                        ))}
                    </Stack>
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{ display: { xs: 'none', sm: 'flex' }, width: '100%' }}
                >
                    <Card
                        variant="outlined"
                        sx={{
                            height: '100%',
                            width: '100%',
                            display: { xs: 'none', sm: 'flex' },
                            pointerEvents: 'none',
                        }}
                    >
                        <Box
                            sx={{
                                m: 'auto',
                                width: 420,
                                height: 500,
                                backgroundSize: 'contain',
                                backgroundImage: (theme) =>
                                    theme.palette.mode === 'light'
                                        ? items[selectedItemIndex].imageLight
                                        : items[selectedItemIndex].imageDark,
                            }}
                        />
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}