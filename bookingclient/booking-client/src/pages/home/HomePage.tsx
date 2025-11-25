import { Container } from "@mui/material";
import Hero from "./components/Hero";
import PropertyTypeList from "./components/PropertyTypeList";
import TrendingDestinations from "./components/TrendingDestinations";
import { ExploreVietnamList } from "./components/ExploreVietnamList";
import { LatestHomestaysSlider } from "./components/LatestHomestaysSlider";
import { TopRatedHomestaysSlider } from "./components/TopRatedHomestaysSlider";
import PublicCouponsSlider from "@/components/coupon/PublicCouponsSlider";

const HomePage = () => {
  return (
    <>
      <Hero />
      <Container sx={{ mt: 4, mb: 6 }}>
        <PropertyTypeList />
        <PublicCouponsSlider />
        <LatestHomestaysSlider />
        <TrendingDestinations />
        <TopRatedHomestaysSlider />
        <ExploreVietnamList />
      </Container>
    </>
  );
};

export default HomePage;
