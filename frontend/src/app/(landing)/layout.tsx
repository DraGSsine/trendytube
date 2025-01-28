import NavBar from "@/components/lnading/navbar/NavBar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <NavBar />
      <div className="pt-28">{children}</div>
    </main>
  );
}
