import { FC, ReactNode, useState, MouseEvent } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  styled,
  Avatar,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { allRoutes } from "@/routes";

interface MainViewProps {
  children: ReactNode;
}

const Container = styled("main")({
  height: `calc(100vh - 70px)`,
});

const StyledLink = styled(Link)({
  color: "white",
  textDecoration: "none",
  marginLeft: "16px",
  "&:hover": {
    textDecoration: "underline",
  },
});

export const MainView: FC<MainViewProps> = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleAvatarClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const firstName = localStorage.getItem("firstName") || "";
  const lastName = localStorage.getItem("lastName") || "";
  const role = localStorage.getItem("role") || "";
  const profileImage = localStorage.getItem("profile");

  const user = { name: `${firstName} ${lastName}`.trim(), role };
  const initials = `${firstName.charAt(0) || ""}${lastName.charAt(0) || ""}`;

  return (
    <Box>
      {/* AppBar */}
      <AppBar position="static" sx={{ height: "70px" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Reservation System
          </Typography>
          {allRoutes
            .filter((route) => route.roles.includes(role)) 
            .map((route, index) => (
              <StyledLink key={index} to={route.path}>
                {route.name}
              </StyledLink>
            ))}

          {/* Avatar */}
          <Avatar
            sx={{ marginLeft: 2, cursor: "pointer" }}
            src={
              profileImage && profileImage.startsWith("blob:")
                ? profileImage
                : undefined
            }
            onClick={handleAvatarClick}
          >
            {!profileImage && initials}
          </Avatar>

          {/* Popover */}
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <List sx={{ minWidth: 200 }}>
              <ListItem>
                <ListItemText primary={user.name} secondary={user.role} />
              </ListItem>
              <ListItemButton
                component={Link}
                to="/"
                onClick={() => {
                  localStorage.clear();
                }}
              >
                Logout
              </ListItemButton>
            </List>
          </Popover>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container>{children}</Container>
    </Box>
  );
};
