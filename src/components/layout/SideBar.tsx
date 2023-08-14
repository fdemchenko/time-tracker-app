import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import {ReactNode, useState} from "react";
import {Link} from "react-router-dom";
import TrackerBar from "../time-tracking/TrackerBar";
import {WorkSessionSliceState} from "../../redux/slices/WorkSessionSlice";
import {UserSliceState} from "../../redux/slices/UserSlice";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import {hasPermit} from "../../helpers/hasPermit";

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

interface SideBarProps {
    userData: UserSliceState,
    workSessionData: WorkSessionSliceState
    children: ReactNode
}
export default function SideBar({userData, workSessionData, children}: SideBarProps) {
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);

    const [timerBarOpen, setTimerBarOpen] = React.useState(false);
    const [trackerDisplay, setTrackerDisplay] = useState("00:00:00");

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    function handleTimerBarOpen(value: boolean) {
        setTimerBarOpen(value);
    }
    function handleSetTrackerDisplay(value: string) {
        setTrackerDisplay(value);
    }

    return (
        <div>
            {userData.isLogged && <TrackerBar
                open={timerBarOpen}
                handleTimerBarOpen={handleTimerBarOpen}
                handleSetTrackerDisplay={handleSetTrackerDisplay}
            />}

            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" open={open}>
                    <Toolbar sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <Box sx={{display: "flex", alignItems: "center"}}>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                                edge="start"
                                sx={{ mr: 2, ...(open && { display: 'none' }) }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Link to="/" style={{textDecoration: "none", color: "white"}}>
                                <Typography variant="h6" noWrap component="div" sx={{textDecoration: "none", color: "white"}}>
                                    Time Tracker
                                </Typography>
                            </Link>
                        </Box>

                        {/*Button which open timer bar*/}
                        {
                            userData.isLogged &&
                            <Box sx={{
                                display: "flex",
                                alignItems: "center"
                            }}>
                                <Box sx={{mr: "14px"}}>
                                    <span>Work session: {trackerDisplay}</span>
                                </Box>

                                <IconButton
                                    color="inherit"
                                    aria-label="open timer"
                                    onClick={() => handleTimerBarOpen(!timerBarOpen)}
                                    edge="start"
                                    sx={{ mr: 2, ...(timerBarOpen && { visibility: 'hidden' }) }}
                                >
                                    <KeyboardArrowLeftIcon />
                                </IconButton>
                            </Box>
                        }
                    </Toolbar>
                </AppBar>
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                    variant="persistent"
                    anchor="left"
                    open={open}
                >
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton sx={{width: 100}}>
                                <Link to={`/worksession/${userData.user.id}`} style={{width: '100%'}}>
                                    <ListItemText>
                                        My work sessions
                                    </ListItemText>
                                </Link>
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton sx={{width: 100}}>
                                <Link to="/profiles" style={{width: '100%'}}>
                                    <ListItemText>
                                        List of profiles of employees
                                    </ListItemText>
                                </Link>
                            </ListItemButton>
                        </ListItem>

                        {hasPermit(userData.user.permissions, "GetUsers") &&
                          <ListItem disablePadding>
                              <ListItemButton sx={{width: 100}}>
                                  <Link to="/users" style={{width: '100%'}}>
                                      <ListItemText>
                                          Manage employees
                                      </ListItemText>
                                  </Link>
                              </ListItemButton>
                          </ListItem>
                        }

                        <ListItem disablePadding>
                            <ListItemButton sx={{width: 100}}>
                                <Link to={`/scheduler/${userData.user.id}`} style={{width: '100%'}}>
                                    <ListItemText>
                                        My scheduler
                                    </ListItemText>
                                </Link>
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton sx={{width: 100}}>
                                <Link to="/vacations" style={{width: '100%'}}>
                                    <ListItemText>
                                        Vacations
                                    </ListItemText>
                                </Link>
                            </ListItemButton>
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        {
                            !userData.isLogged ? (
                                <ListItem disablePadding>
                                    <ListItemButton sx={{width: 100}}>
                                        <Link to="/user/login" style={{width: '100%'}}>
                                            <ListItemText>
                                                Log in
                                            </ListItemText>
                                        </Link>
                                    </ListItemButton>
                                </ListItem>
                            ) : (
                                <ListItem disablePadding>
                                    <ListItemButton sx={{width: 100}}>
                                        <Link to="/user/logout" style={{width: '100%'}}>
                                            <ListItemText>
                                                Log out
                                            </ListItemText>
                                        </Link>
                                    </ListItemButton>
                                </ListItem>
                            )
                        }
                    </List>
                </Drawer>
                <Main open={open}>
                    <DrawerHeader />

                    {children}
                </Main>
            </Box>
        </div>
    );
}