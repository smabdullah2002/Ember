import Banner_1 from '../../components/Banners/Banner_1';
import Grid_Banner from '../../components/Banners/Grid_Banner';
import FAQAccordion from '../../components/Faq/Faq';
import Join from '../../components/Join/Join';
import Footer from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';


const Home = () => {
    return (
        <div >
            <div className='flex flex-col items-center justify-center mx-auto min-h-screen relative'>
                <h1 className='text-5xl font-bold'>
                    Welcome to <span className='text-blue-500 font-serif'>Bliss</span>
                </h1>
                <h2 className='text-2xl font-mono'>Your Mental Health Companion</h2>
                <Link to="/registration">
                    <button className="mt-6 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-md font-semibold text-lg transition">
                        Get Started
                    </button>
                </Link>
            </div>

            <div className='divider'></div>

            <div className='relative w-full h-screen'>
                <Banner_1 />
                <Grid_Banner />
                <FAQAccordion />
                <Join />
                <Footer />

            </div>

        </div>


    );
};

export default Home;