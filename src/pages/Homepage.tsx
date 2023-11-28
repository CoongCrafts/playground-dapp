import About from '@/pages/About';
import MySpaces from '@/pages/MySpaces';
import { useWalletContext } from '@/providers/WalletProvider';

function Homepage() {
  const { selectedAccount } = useWalletContext();

  if (selectedAccount) {
    return <MySpaces />;
  }

  return <About />;
}

export default Homepage;
