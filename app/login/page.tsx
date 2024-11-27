import Logo from '@/app/ui/logo';
import LoginForm from '@/app/ui/login-form';

export default async function Page() {
    return (
        <main className="flex items-center justify-center md:h-screen">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <div className="flex h-20 w-full justify-center items-center rounded-lg bg-primary p-3 md:h-36">
                    <div className="text-white  ">
                        <Logo />
                    </div>
                </div>
                <LoginForm />
            </div>
        </main>
    );
}