import Banner_1 from '../../components/Banners/Banner_1';
import Grid_Banner from '../../components/Banners/Grid_Banner';
import FAQAccordion from '../../components/Faq/Faq';
import Join from '../../components/Join/Join';
import Footer from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';
import { AuroraText } from "@/components/ui/aurora-text"
import { TypingAnimation } from '@/components/ui/typing-animation';


const Home = () => {
    return (
        <div >
            <div className='flex flex-col items-center justify-center mx-auto min-h-screen relative'>
                <h1 className='text-5xl font-bold'>
                    Welcome to <AuroraText className='font-serif'>Ember</AuroraText>
                </h1>
                {/* <h2 className='text-2xl font-mono'>Your Mental Health Companion</h2> */}
                <TypingAnimation className='text-2xl font-mono'>Your Mental Health Companion</TypingAnimation>
                <Link to="/registration">
                    <button className="mt-6 px-6 py-3 bg-white/20 hover:bg-white/50 rounded-lg backdrop-blur-md font-semibold text-lg transition">
                        Get Started
                    </button>
                </Link>
            </div>

            <div className='divider'></div>

            <div className='relative pt-20'>
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