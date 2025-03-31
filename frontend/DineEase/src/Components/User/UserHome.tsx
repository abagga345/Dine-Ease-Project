import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import AppAppBar from './Home/AppAppBar';
import Hero from './Home/Hero';
import Features from './Home/Features';
import Testimonials from './Home/Testimonials';
import Footer from './Home/Footer';

export default function UserHome() {


    return (
        <>
            <CssBaseline />
            <AppAppBar/>
            <Hero />
            <Box sx={{ bgcolor: 'background.default' }}>
                <Features />
                <Divider />
                <Testimonials />
                <Divider />
                <Footer />
            </Box>
        </>
    );
}