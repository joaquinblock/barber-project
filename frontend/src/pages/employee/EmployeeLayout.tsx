import { EmployeeNavBar } from '@/shared/components/layout';
import { Outlet } from 'react-router-dom';

export const EmployeeLayout = () => {
    return (
        <>
            <EmployeeNavBar /> 
            <main>
                <Outlet /> {/* <-- Acá se va a renderizar SchedulePage o BarberConfigPage */}
            </main>
        </>
    );
}