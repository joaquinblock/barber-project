import { Outlet } from 'react-router-dom';
import { BusinessNavBar } from '@/shared/components/layout';

export const BusinessPage = () => {
    return (
        <>
            <BusinessNavBar /> 
            <main>
                <Outlet /> {/* <-- Acá se va a renderizar SchedulePage, TeamPage, ProfessionalConfigPage, etc */}
            </main>
        </>
    );
}