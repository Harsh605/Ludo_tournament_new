
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import Divider from '@mui/material/Divider';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LineStyleIcon from '@mui/icons-material/LineStyle';
import GroupIcon from '@mui/icons-material/Group';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import ChromeReaderModeIcon from '@mui/icons-material/ChromeReaderMode';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import PersonIcon from '@mui/icons-material/Person';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import GavelIcon from '@mui/icons-material/Gavel';
import { ExpandLess, ExpandMore, Settings, StarBorder } from '@mui/icons-material';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import Challenge from './ChallengeManager';
import AdminEarning from './AdminEarning';
import UserManager from './UserManager';
import AdminLoginPage from "./Authentication/LoginPage"
import Setting from './Setting';
import AdminManager from './AdminManager';
import EditPermission from './Permissions/EditPermission';
import AdminProfile from './AdminProfile';
import { useState, useEffect } from 'react';
import Addcoins from './DepositPayment';
import Withdrawcoins from './Withdrawcoins';
import AvatarMenu from "./AvatarMenu";
import GameJudgement from './ConflictChallenge';
import AdminRegistrationPage from './Authentication/CreateAdmin';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';



const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));



const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export default function Header(props) {
    const [openDrawer, setOpenDrawer] = useState(false);
    const location = useLocation()
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);
    const [open2, setOpen2] = React.useState({
        open1: false,
        open2: false,
        open3: false,
        open4: false
    });
    const [swidth, setWidth] = useState(window.innerWidth);
    const navigate = useNavigate();




    // const [selectedOption, setSelectedOption] = React.useState('View all users');
    const AppBar = styled(MuiAppBar, {


        shouldForwardProp: (prop) => prop !== 'open',

    })(({ theme, open }) => ({
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && swidth > 768 && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
    }));
    // const options = [
    //     'View all users',
    //     'Add new users',
    //     'Pending KYC',
    //     'Completed KYC',
    //     'Reject KYC',
    // ];

    // const handleOptionChange = (event) => {
    //     setSelectedOption(event.target.value);
    // };
    //const container = window !== undefined ? () => window().document.body : undefined;
    useEffect(() => {
        function handleWindowResize() {
            setWidth(window.innerWidth)
        }
        window.addEventListener('resize', handleWindowResize);
        console.log(swidth)
        return () => window.removeEventListener('resize', handleWindowResize);
    }, []);


    const handleBackdropClick = () => {
        if (swidth <= 768) {
            setOpenDrawer(false);
            setOpen(false);
        }
    };
    const handleDrawerOpen = () => {
        setOpenDrawer(!openDrawer);
        setOpen(true);
    };
    const handleClick = (value) => {
        const payload = {
            open1: false,
            open2: false,
            open3: false,
            open4: false
        }
        payload[value] = !open2[value];
        setOpen2(payload);
    };

    const handleDrawerClose = () => {
        setOpenDrawer(false);
        setOpen(false);
    };
    const routeArr = [
        { route: 'dashboard', per: 'dashboard' },
        { route: 'UserManager', per: 'allUsers' },
        { route: 'kyc-detail', per: 'kycDetail' },
        { route: 'all-income', per: 'allIncome' },
        { route: 'AdminManager', per: 'allAdmin' },
        { route: 'AdminEarning', per: 'earning' },
        { route: 'deposit', per: 'deposit' },
        { route: 'withdraw', per: 'withdrawl' },
        { route: 'penalty-bonus', per: 'penaltyBonus' },
        { route: 'wallet-ledger', per: 'transactionHistory' },
        { route: 'all-challenge', per: 'allGame' },
        { route: 'running-challenge', per: 'runningGame' },
        { route: 'completed-challenge', per: 'completedGame' },
        { route: 'cancelled-challenge', per: 'cancelledGame' },
        { route: 'conflict-challenge', per: 'conflictGame' },
        { route: 'drop-challenge', per: 'dropGame' },
        { route: 'Setting', per: 'masterSetting' },
    ]

    const handleRoute = (route) => {
        const routeFind = routeArr.find(item=> item.route === route)?.per || ''
        return routeFind
    }

    useEffect(() => {
        if(location.pathname === '/') {
            navigate('/')
        }
        const permi = handleRoute(location.pathname.slice(1))
        if(['AdminProfile', 'agent/permissions', 'view', 'game-view', 'register', 'update-password'].includes(location.pathname.slice(1))) {

        } else if(!props.permission[permi] && Object.keys(props.permission).length > 0)
            navigate('/dashboard')

        const obj = { ...open2 };
        if (['UserManager', 'kyc-detail', 'all-income'].includes(location.pathname.slice(1))) {
            obj.open3 = true
        }
        if (['AdminProfile', 'AdminManager', 'AdminEarning'].includes(location.pathname.slice(1))) {
            obj.open1 = true
        }
        if (['deposit', 'withdraw', 'penalty-bonus', 'wallet-ledger'].includes(location.pathname.slice(1))) {
            obj.open4 = true
        }
        if (['all-challenge', 'running-challenge', 'completed-challenge', 'cancelled-challenge', 'conflict-challenge', 'drop-challenge'].includes(location.pathname.slice(1))) {
            obj.open2 = true
        }
        setOpen2(obj)
    }, [props.permission, location.pathname])

    const drawer = (
        <>
            <DrawerHeader style={{ backgroundColor: " #00064b" }}>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon sx={{ color: "white" }} />}
                </IconButton>
            </DrawerHeader>
            <Divider sx={{ background: 'black' }} />
            <List>

            </List>
            <Divider />
            <List className='main-list' sx={{ color: "white", fontWeight: "500", backgroundColor: "#00064b" }}>
                {/* <ListItem disablePadding sx={{ display: 'block' }} >
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                    }}
                                    onClick={() => navigate("/register")}  >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}

                                    >
                                        <PersonAdd sx={{ color: "blue", fontSize: "30px" }} />
                                    </ListItemIcon>
                                    <ListItemText primary="Create Admin" sx={{ opacity: open ? 1 : 0 }} />
                                </ListItemButton>
                            </ListItem>
                            */}
                {props.permission.dashboard && <ListItem disablePadding sx={{ display: 'block' }} >
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        onClick={() => navigate("/dashboard")}  >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}

                        >
                            <DashboardCustomizeIcon sx={{ color: "blue", fontSize: "30px" }} />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                </ListItem>}
                <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        // onClick={() => navigate('/Challenge')} >
                        onClick={() => handleClick('open1')} >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            <AdminPanelSettingsIcon sx={{ color: "blue", fontSize: "30px" }} />
                        </ListItemIcon>
                        <ListItemText primary="Admin Manager" sx={{ opacity: open ? 1 : 0 }} />
                        {open2?.open1 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open2?.open1} timeout="auto" unmountOnExit>
                        <ListItem disablePadding sx={{ display: 'block' }} >
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 4,
                                }}
                                onClick={() => navigate('/AdminProfile')}  >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >

                                    <SupervisorAccountIcon sx={{ color: "#00eaff", fontSize: "30px" }} />
                                </ListItemIcon>
                                <ListItemText primary="Profile" sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                        {props.permission.allAdmin && <ListItem disablePadding sx={{ display: 'block' }} >
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 4,
                                }}
                                onClick={() => navigate('/AdminManager')}  >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <AdminPanelSettingsIcon sx={{ color: "red", fontSize: "30px" }} />
                                </ListItemIcon>
                                <ListItemText primary="All Admin" sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>}
                        {props.permission.earning && <ListItem disablePadding sx={{ display: 'block' }} >
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 4,
                                }}
                                onClick={() => navigate('/AdminEarning')}  >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >

                                    <AttachMoneyIcon sx={{ color: "yellow", fontSize: "30px" }} />
                                </ListItemIcon>
                                <ListItemText primary="Earning" sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>}
                    </Collapse>
                </ListItem>

                {(props.permission.allUsers || props.permission.kycDetail || props.permission.allIncome) && <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        // onClick={() => navigate('/Challenge')} >
                        onClick={() => handleClick('open3')} >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            <ManageAccountsIcon sx={{ color: "blue", fontSize: "30px" }} />
                        </ListItemIcon>
                        <ListItemText primary="User Manager" sx={{ opacity: open ? 1 : 0 }} />
                        {open2?.open3 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open2?.open3} timeout="auto" unmountOnExit>
                        {props.permission.allUsers && <ListItem disablePadding sx={{ display: 'block' }} >
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 4,
                                }}
                                onClick={() => navigate('/UserManager')}  >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >

                                    <PersonIcon sx={{ color: "lightBlue", fontSize: "30px" }} />
                                </ListItemIcon>
                                <ListItemText primary="All User" sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>}
                        {props.permission.kycDetail && <ListItem disablePadding sx={{ display: 'block' }} >
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 4,
                                }}
                                onClick={() => navigate('/kyc-detail')}  >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >

                                    <PlagiarismIcon sx={{ color: "lightBlue", fontSize: "30px" }} />
                                </ListItemIcon>
                                <ListItemText primary="KYC Detail" sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>}
                        {props.permission.allIncome && <ListItem disablePadding sx={{ display: 'block' }} >
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 4,
                                }}
                                onClick={() => navigate('/all-income')}  >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >

                                    <RequestQuoteIcon sx={{ color: "lightBlue", fontSize: "30px" }} />
                                </ListItemIcon>
                                <ListItemText primary="All Income" sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>}
                    </Collapse>
                </ListItem>}

                {(props.permission.deposit || props.permission.withdrawl || props.permission.penaltyBonus || props.permission.transactionHistory) && <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        // onClick={() => navigate('/Challenge')} >
                        onClick={() => handleClick('open4')} >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            <AccountBalanceWalletIcon sx={{ color: "blue", fontSize: "30px" }} />
                        </ListItemIcon>
                        <ListItemText primary="Transaction Manager" sx={{ opacity: open ? 1 : 0 }} />
                        {open2?.open4 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open2?.open4} timeout="auto" unmountOnExit>
                        {props.permission.deposit && <ListItem disablePadding sx={{ display: 'block' }} >
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 4,
                                }}
                                onClick={() => navigate('/deposit')}  >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >

                                    <AccountBalanceIcon sx={{ color: "lightBlue", fontSize: "30px" }} />
                                </ListItemIcon>
                                <ListItemText primary="Deposit" sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>}
                        {props.permission.withdrawl && <ListItem disablePadding sx={{ display: 'block' }} >
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 4,
                                }}
                                onClick={() => navigate('/withdraw')}  >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >

                                    <AccountBalanceIcon sx={{ color: "lightBlue", fontSize: "30px" }} />
                                </ListItemIcon>
                                <ListItemText primary="Withdraw" sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>}
                        {props.permission.penaltyBonus && <ListItem disablePadding sx={{ display: 'block' }} >
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 4,
                                }}
                                onClick={() => navigate('/penalty-bonus')}  >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >

                                    <ChromeReaderModeIcon sx={{ color: "lightBlue", fontSize: "30px" }} />
                                </ListItemIcon>
                                <ListItemText primary="Penalty & Bonus" sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>}
                        {props.permission.transactionHistory && <ListItem disablePadding sx={{ display: 'block' }} >
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 4,
                                }}
                                onClick={() => navigate('/wallet-ledger')}  >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >

                                    <ReceiptLongIcon sx={{ color: "lightBlue", fontSize: "30px" }} />
                                </ListItemIcon>
                                <ListItemText primary="Transaction History" sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>}
                    </Collapse>
                </ListItem>}



                {/* <ListItem disablePadding sx={{ display: 'block' }} >
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        onClick={() => navigate('/penalty-bonus')}  >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >

                            <AccountCircleIcon sx={{ color: "lightBlue", fontSize: "30px" }} />
                        </ListItemIcon>
                        <ListItemText primary="Penalty&Bonus" sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                </ListItem> */}

                {/* <ListItem disablePadding sx={{ display: 'block' }} >
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        onClick={() => navigate('/all-income')}  >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >

                            <RequestQuoteIcon sx={{ color: "lightBlue", fontSize: "30px" }} />
                        </ListItemIcon>
                        <ListItemText primary="All Income" sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding sx={{ display: 'block' }} >
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        onClick={() => navigate('/wallet-ledger')}  >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >

                            <ReceiptLongIcon sx={{ color: "lightBlue", fontSize: "30px" }} />
                        </ListItemIcon>
                        <ListItemText primary="Transaction History" sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                </ListItem> */}
                {/* <ListItem disablePadding sx={{ display: 'block' }} >
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        onClick={() => navigate('/all-transaction')}  >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >

                            <AccountCircleIcon sx={{ color: "lightBlue", fontSize: "30px" }} />
                        </ListItemIcon>
                        <ListItemText primary="All Transaction" sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                </ListItem> */}
                {/* <ListItem disablePadding sx={{ display: 'block' }} >
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        onClick={() => navigate('/deposit')}  >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >

                            <AccountCircleIcon sx={{ color: "lightBlue", fontSize: "30px" }} />
                        </ListItemIcon>
                        <ListItemText primary="Deposit" sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding sx={{ display: 'block' }} >
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        onClick={() => navigate('/withdraw')}  >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >

                            <AccountCircleIcon sx={{ color: "lightBlue", fontSize: "30px" }} />
                        </ListItemIcon>
                        <ListItemText primary="Withdraw" sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                </ListItem> */}

                {/* <ListItem disablePadding sx={{ display: 'block' }} >
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        onClick={() => navigate('/Addcoins')}  >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >

                            <MonetizationOnIcon sx={{ color: "yellow", fontSize: "30px" }} />
                        </ListItemIcon>
                        <ListItemText primary="Deposit Payments" sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                </ListItem> */}
                {(props.permission.allGame || props.permission.runningGame || props.permission.completedGame || props.permission.cancelledGame || props.permission.conflictGame || props.permission.dropGame) && <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        // onClick={() => navigate('/Challenge')} >
                        onClick={() => handleClick('open2')} >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            <SportsEsportsIcon sx={{ color: "blue", fontSize: "30px" }} />
                        </ListItemIcon>
                        <ListItemText primary="Game Manager" sx={{ opacity: open ? 1 : 0 }} />
                        {open2?.open2 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open2?.open2} timeout="auto" unmountOnExit>
                        {props.permission.allGame && <ListItem disablePadding sx={{ display: 'block' }}>
                            <ListItemButton sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 4,
                            }}
                                onClick={() => navigate('/all-challenge')}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <StarBorder sx={{ color: "lightGreen", fontSize: "30px" }} />
                                </ListItemIcon>
                                <ListItemText primary="All" sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>}
                        {props.permission.runningGame && <ListItem disablePadding sx={{ display: 'block' }}>
                            <ListItemButton sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 4,
                            }}
                                onClick={() => navigate('/running-challenge')}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <StarBorder sx={{ color: "lightGreen", fontSize: "30px" }} />
                                </ListItemIcon>
                                <ListItemText primary="Running" sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>}
                        {props.permission.completedGame && <ListItem disablePadding sx={{ display: 'block' }}>
                            <ListItemButton sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 4,
                            }}
                                onClick={() => navigate('/completed-challenge')}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <StarBorder sx={{ color: "lightGreen", fontSize: "30px" }} />
                                </ListItemIcon>
                                <ListItemText primary="Completed" sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>}
                        {props.permission.cancelledGame && <ListItem disablePadding sx={{ display: 'block' }}>
                            <ListItemButton sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 4,
                            }}
                                onClick={() => navigate('/cancelled-challenge')}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <StarBorder sx={{ color: "lightGreen", fontSize: "30px" }} />
                                </ListItemIcon>
                                <ListItemText primary="Cancelled" sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>}
                        {props.permission.conflictGame && <ListItem disablePadding sx={{ display: 'block' }}>
                            <ListItemButton sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 4,
                            }}
                                onClick={() => navigate('/conflict-challenge')}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <StarBorder sx={{ color: "lightGreen", fontSize: "30px" }} />
                                </ListItemIcon>
                                <ListItemText primary="Conflict" sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>}
                        {props.permission.dropGame && <ListItem disablePadding sx={{ display: 'block' }}>
                            <ListItemButton sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 4,
                            }}
                                onClick={() => navigate('/drop-challenge')}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <StarBorder sx={{ color: "lightGreen", fontSize: "30px" }} />
                                </ListItemIcon>
                                <ListItemText primary="Drop" sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>}
                    </Collapse>
                </ListItem>}

                {/* <ListItem disablePadding sx={{ display: 'block' }} >
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        onClick={() => navigate('/GameJudgement')}  >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            <GavelIcon sx={{ color: "yellow", fontSize: "30px" }} />
                        </ListItemIcon>
                        <ListItemText primary="Conflict Challenges" sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                </ListItem> */}
                {/* <ListItem disablePadding sx={{ display: 'block' }} >
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                                onClick={() => navigate('/NewTransaction')}  >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >

                                    <AccountBalanceWalletIcon sx={{ color: "orange", fontSize: "30px" }} />
                                </ListItemIcon>
                                <ListItemText primary="Transcation Manager" sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem> */}



                {/* <ListItem disablePadding sx={{ display: 'block' }} >
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        onClick={() => navigate('/Withdrawcoins')}  >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >

                            <MoneyOffIcon sx={{ color: "yellow", fontSize: "30px" }} />
                        </ListItemIcon>
                        <ListItemText primary="Withdraw Payments" sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                </ListItem> */}

                {props.permission.masterSetting && <ListItem disablePadding sx={{ display: 'block' }} >
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        onClick={() => navigate('/Setting')}  >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            <Settings sx={{ color: "gray", fontSize: "30px" }} />
                        </ListItemIcon>
                        <ListItemText primary="Master Setting" sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                </ListItem>}
            </List>
        </>
    )

    return (
        <div className="container-section">
            <Box sx={{
                display: 'flex', animation: `$fadeInOut} 1s`,
                transition: '0.8s !important',
                transitionDuration: '0.9s !important',
                transitionTimingFunction: 'ease !important',
            }}>
                {/* <CssBaseline /> */}
                <AppBar sx={{ justifyContent: "space-between" }} position="fixed" open={open} component="nav">
                    <Toolbar sx={{ justifyContent: "space-between", background: " #00064b " }}>
                        <IconButton
                            color="white"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{
                                color: "white",
                                marginRight: 5,
                                ...(open && { display: 'block' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <AvatarMenu />

                    </Toolbar>

                </AppBar>
                <nav>
                    {
                        swidth > 768 ? (<Drawer sx={{ background: '#00064b' }} variant="permanent" open={open} >
                            {drawer}
                        </Drawer>) : (
                            <MuiDrawer variant="persistent" sx={{ background: '#00064b' }} open={open} onClick={handleBackdropClick} >
                                {drawer}
                            </MuiDrawer>
                        )
                    }
                </nav>

                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 5,
                        overflow: 'auto',
                        '@media (max-width:600px)': {
                            p: 2, // Adjust padding for smaller screens
                        },
                        '@media (max-width:960px)': {
                            p: 2, // Further adjust padding for medium screens
                        },
                    }}
                >
                    {props.outlet}


                    {/* <Routes>
                        <Route exact path='/' element={<AdminLoginPage />}></Route>
                        <Route exact path='/' element={<Dashboard />}></Route>

                        <Route exact path='/register' element={<AdminRegistrationPage />}></Route>
                        <Route exact path='/Challenge' element={<Challenge />}></Route>
                        <Route exact path='/UserManager' element={<UserManager />}></Route>
                        <Route exact path='/AdminManager' element={<AdminManager />}></Route>
                        <Route exact path='/NewTransaction' element={<NewTransaction />}></Route>
                        <Route exact path='/EditPermissionr' element={<EditPermission />}></Route>
                        <Route exact path='/AdminEarning' element={<AdminEarning />}></Route>
                        <Route exact path='/AdminProfile' element={<AdminProfile />}></Route>
                        <Route exact path='/Addcoins' element={<Addcoins />}></Route>
                        <Route exact path='/Withdrawcoins' element={<Withdrawcoins />}></Route>
                        <Route exact path='/GameJudgement' element={<GameJudgement />}></Route>
                        <Route exact path='/Setting' element={<Setting />}></Route>
                    </Routes> */}

                    {/* <Dashboard /> */}
                </Box>
            </Box>
        </div >
    );
}