import {Alert, Box, Button, Grid} from "@mui/material";
import {useNavigate} from "react-router-dom";
import * as React from "react";

export default function AccessDenied() {
    const navigate = useNavigate();

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: '60vh' }}
        >
            <Grid item xs={3}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "20px",
                        m: 2
                    }}
                >
                    <Alert color="error">
                        Sorry, but you have no access for this route.
                        Please contact administrator to solve the issue.
                    </Alert>
                    <Button
                        variant="outlined"
                        color="secondary"
                        size="large"
                        onClick={() => navigate(-1)}
                    >
                        Go back
                    </Button>
                </Box>
            </Grid>
        </Grid>
    );
}