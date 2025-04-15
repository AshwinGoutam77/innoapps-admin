import Image from 'next/image';
import React from 'react';
import logoSm from '@/assets/images/logo-sm.png';
import logo from '@/assets/images/logo/nav-logo.svg';
import logoDark from '@/assets/images/logo-dark.png';
const LogoBox = () => {
  return <a href="/" className="logo">
      <span className="logo-light">
        <span className="logo-lg"><Image width={110} height={22} src={logo} alt="logo" /></span>
        <span className="logo-sm"><Image width={28} height={28} src={logo} alt="small logo" /></span>
      </span>
      <span className="logo-dark">
        <span className="logo-lg"><Image width={140} height={33} src={logo} alt="dark logo" /></span> 
      </span>
    </a>;
};
export default LogoBox; 