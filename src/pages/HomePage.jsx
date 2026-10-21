import Hero from '../components/Hero';
import FeaturedServicesGrid from '../components/FeaturedServicesGrid';
import ValueProposition from '../components/ValueProposition';
import QuickCalculator from '../components/QuickCalculator';
import ReviewsSection from '../components/ReviewsSection';
import FaqAccordion from '../components/FaqAccordion';

export default function HomePage() {
  return (
    <div className="w-full flex flex-col">
      <Hero />
      <FeaturedServicesGrid />
      <ValueProposition />
      <QuickCalculator />
      <ReviewsSection />
      <FaqAccordion />
    </div>
  );
}
