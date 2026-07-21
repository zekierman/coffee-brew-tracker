import { login } from "@/app/actions/auth";
import { AuthForm } from "@/components/auth-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Giriş yap</CardTitle>
        <CardDescription>Demleme günlüğüne devam et.</CardDescription>
      </CardHeader>
      <CardContent>
        <AuthForm
          action={login}
          submitLabel="Giriş yap"
          footer={{ text: "Hesabın yok mu?", linkLabel: "Kayıt ol", href: "/register" }}
        />
      </CardContent>
    </Card>
  );
}
