import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import Homepage from '@/pages/Homepage';
import MySpaces from '@/pages/MySpaces';
import Space from '@/pages/Space';
import SpaceLauncher from '@/pages/SpaceLauncher';
import UploadContracts from '@/pages/UploadContracts';
import Posts from '@/pages/plugins/Posts';
import Members from '@/pages/space/Members';
import Settings from '@/pages/space/Settings';

export default createBrowserRouter(
  createRoutesFromElements([
    <Route path='/' element={<MainLayout />}>
      <Route index element={<Homepage />} />
      <Route path='/spaces' element={<MySpaces />} />,
      <Route path='/:chainId/spaces/:spaceAddress' element={<Space />}>
        <Route path='posts' element={<Posts />} />,
        <Route path='members' element={<Members />} />,
        <Route path='settings' element={<Settings />} />,
      </Route>
      ,
      <Route path='/upload' element={<UploadContracts />} />,
      <Route path='/launch' element={<SpaceLauncher />} />,
    </Route>,
  ]),
);
