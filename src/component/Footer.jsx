import React from 'react'
import '../css/Footer.css'
import Visa from '../assets/png payment/visa.png'
export function Footer() {
  return (
    <>
    <div className='w-auto flex justify-center bg-[#ecd9e8]'>
    <div className='md:container md:mx-auto px-10 py-4'>
        <div className='grid grid-cols-10 gap-4  justify-items-center '>
            <div className="col-span-3 md:grid-cols-6">
                <h3 className='text-[#323232] font-medium leading-none text-lg'>Get To Know Us</h3>
                <p className='text-[#323232] moveOfPInFooter my-2'>About Us</p>
            </div>
            <div className="col-span-3">
                <h3 className='text-[#323232] font-medium leading-none text-lg'>Navigation</h3>
                <p className='text-[#323232] moveOfPInFooter my-2'>Categories</p>
            </div>
            {/* <div className="col-span-3">
                <h3 className='text-[#323232] text-lg font-medium leading-none'>My Account</h3>
                <p className='text-[#323232] moveOfPInFooter my-2'>Login</p>
            </div> */}
            <div className="col-span-3">
                <h3 className='text-[#323232] font-medium text-lg leading-none'>Payment Methods</h3>
                <div className='grid grid-col-12 gap-3'>
                    <div className='col-span-3 my-2'>
                        <img src={Visa} alt="visa" width="38" height="44" class="visa-logo" className='rounded-md '/>
                    </div>
                </div>
                <h3 className='text-[#323232] font-medium text-lg leading-none '>Follow Us</h3>
                <div className='grid grid-col-12 gap-3'>
                    <div className='col-span-3 my-2'>
                    <a className='moveForIcons' href="https://www.facebook.com/ByAseelKamal" target='_blank'><i className="fa-brands fa-facebook-f text-xl text-blue-900"></i></a>
                   <a className='moveForIcons' href="https://www.instagram.com/ak_byaseelkamal?igshid=YmMyMTA2M2Y%3D&fbclid=IwY2xjawER8KxleHRuA2FlbQIxMAABHamKXnEIEwbf3nVKRaTcPFzOGqPnhmc9Tem5Q4TUlQm4-Vqi6Hh0DWD5og_aem_KXlJIj7Z09I5LtkE7onq8Q" target="_blank">
                   <i className="fa-brands fa-instagram text-xl mx-4 bgForInstaIcon"></i>
                   </a>
                    <a href="https://www.tiktok.com/@akflorist2020?_t=8oNJ3QDHDAj&_r=1" target="_blank" className='moveForIcons'><i className="fa-brands fa-tiktok text-black text-xl"></i></a>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
    </div>
    <div className='bg-[#323232]'>
        <p className='text-center text-white p-3'>Copyrights © 2024 Flowrista. All rights reserved.</p>
    </div>
    </>
  )
}
