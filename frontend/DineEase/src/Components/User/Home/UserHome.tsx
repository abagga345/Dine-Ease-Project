import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import AppAppBar from './AppAppBar';
import Hero from './Hero';
import Features from './Features';
import Testimonials from './Testimonials';
import Footer from './Footer';

export function UserHome() {


    return (
        <>
            <CssBaseline />
            
            <Hero>
                <AppAppBar></AppAppBar>
            </Hero>
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