import { auth } from "@/lib/auth/auth";
import { HomeExploreExperience } from "@/components/home/home-explore-experience";

export default async function HomePage() {
  const session = await auth();

  return <HomeExploreExperience isLoggedIn={Boolean(session?.user)} />;
}

<p>Este es un cambio en la rama dev.</p>