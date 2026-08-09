import Hero from "../Components/Hero";
import Categories from "../Components/Categories";

export default function HomePage() {
  return (
    <div className="home-page">

      {/* Hero Section */}
      <Hero />

      {/* Categories */}
      <Categories />

      {/* এখানে পরে Most Selling / Reviews / About section
          থাকলে সেগুলো add করবে */}

    </div>
  );
}