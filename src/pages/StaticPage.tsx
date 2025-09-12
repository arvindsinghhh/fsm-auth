import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import { staticPagesData } from '../data/staticPagesData';
import { StaticPageKey } from '../types/staticPages';

const StaticPage: React.FC = () => {
    const { pageKey } = useParams<{ pageKey: StaticPageKey }>();

    if (!pageKey || !(pageKey in staticPagesData)) {
        return <Navigate to="/" replace />;
    }

    const pageData = staticPagesData[pageKey as StaticPageKey];

    return (
        <Container maxWidth="lg">
            <Box py={4}>
                <Typography variant="h2" component="h1" gutterBottom>
                    {pageData.title}
                </Typography>
                <Box 
                    dangerouslySetInnerHTML={{ __html: pageData.content }} 
                    sx={{
                        '& h1': {
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            mb: 3,
                            mt: 2
                        },
                        '& h2': {
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            mb: 2,
                            mt: 3
                        },
                        '& h3': {
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            mb: 2,
                            mt: 2
                        },
                        '& p': {
                            mb: 2,
                            lineHeight: 1.6
                        },
                        '& ul, & ol': {
                            ml: 3,
                            mb: 2
                        },
                        '& li': {
                            mb: 1
                        }
                    }}
                />
                <Typography variant="body2" color="text.secondary" mt={4}>
                    Last updated: {pageData.lastUpdated}
                </Typography>
            </Box>
        </Container>
    );
};

export default StaticPage;
