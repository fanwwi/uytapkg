import PublicProfile from "../components/PublicProfile";

export default async function PublicProfilePage({ params }) {
  const { id } = await params;

  return <PublicProfile profileId={id} />;
}
