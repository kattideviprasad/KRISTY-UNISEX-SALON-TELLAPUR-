import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import BookingCTA from '@/components/BookingCTA';
import Testimonials from '@/components/Testimonials';
import Gallery from '@/components/Gallery';
import About from '@/components/About';
import TwoStudios from '@/components/TwoStudios';
import FindUsMap from '@/components/FindUsMap';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Services />
        <Testimonials />
        <Gallery />
        <About />
        <TwoStudios />
        <BookingCTA />
      </main>
      <FindUsMap />
      <Footer />
    </>
  );
}
