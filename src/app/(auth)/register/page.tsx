import { register } from "@/app/actions/auth";
import { AuthForm } from "@/components/auth-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kayıt ol</CardTitle>
        <CardDescription>Kendi demleme günlüğünü tut.</CardDescription>
      </CardHeader>
      <CardContent>
        <AuthForm
          action={register}
          submitLabel="Kayıt ol"
          withName
          footer={{ text: "Hesabın var mı?", linkLabel: "Giriş yap", href: "/login" }}
        />
      </CardContent>
    </Card>
  );
}
