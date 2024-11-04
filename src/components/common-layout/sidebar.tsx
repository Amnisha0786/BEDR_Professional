import { DashboardNav } from '@/components/common-layout/dashboard-nav';
import { cn, getSideBarContent } from '@/lib/utils';
import useUserProfile from '@/hooks/useUserProfile';
import Loader from '../custom-loader';

export default function Sidebar() {
  const userProfile = useUserProfile();
  if (!userProfile) {
    return <Loader />;
  }

  return (
    <nav
      className={cn(
        `sticky top-0 hidden h-[calc(100vh-80px)] !w-[17rem] !overflow-y-auto lg:flex`,
      )}
    >
      <div className='py-[29px] pr-[23px]'>
        <DashboardNav items={getSideBarContent(userProfile?.role)} />
      </div>
    </nav>
  );
}
