import Logo from '@/app/ui/logo';
import LoginForm from '@/app/ui/login-form';

export default async function Page() {
    return (
        <main className="flex items-center justify-center md:h-screen">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 md:-mt-32 md:border border-primary md:rounded-xl md:shadow-xl md:shadow-primary">
                <div className="flex h-26 w-full justify-center items-center md:rounded-t-xl bg-primary p-3 md:h-32">
                    <Logo className='h-16 w-16 md:w-32 md:h-32 flex justify-center items-center' />
                </div>
                <LoginForm />
            </div>
        </main>
    );
}