import { useUser, SignOutButton } from '@clerk/nextjs';
import Layout from './layout';

export default function Dashboard() {
  const { user } = useUser();

  return (
    <Layout>
      <main>Dashboard</main>
    </Layout>
  );
}
