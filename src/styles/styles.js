import styled from 'styled-components';

export const NavbarContainer = styled.nav`
position: fixed;
top: 0;
height: 60px;
background-color: #1A1A1A; // Charcoal
color: #FFFFFF; // White
display: flex;
align-items: center;
justify-content: space-between;
padding: 0 20px;
z-index: 1000;
transition: left 0.3s ease-in-out, width 0.3s ease-in-out;
`;

export const Logo = styled.h2`
font-size: 20px;
margin: 0; // Remove extra space
padding: 0;
white-space: nowrap; // Ensure it's in one line
color: #FFCC00; // Gold
&:hover {
    transform: scale(1.1);
    color: #FF6347; // Orange
}
`;

export const NavLinks = styled.div`
display: flex;
gap: 20px;
`;

export const NavLink = styled.button`
background: none;
border: none;
color: #FFFFFF; // White
cursor: pointer;
font-size: 16px;
display: flex;
align-items: center;
transition: color 0.3s;

&:hover {
    color: #FF6347; // Orange
}
`;

export const NavItem = styled.div`
display: flex;
align-items: center;
`;
