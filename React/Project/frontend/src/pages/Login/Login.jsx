import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Card, Alert } from "react-bootstrap";
import API from "../../api/axios";

const schema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
});

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });

    const mutation = useMutation({
        mutationFn: (data) => API.post("/auth/login", data),
        onSuccess: (res) => {
            dispatch(setCredentials({ token: res.data.data.token }));
            navigate("/dashboard");
        },
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    return (
        <Card className="mx-auto mt-5" style={{ maxWidth: "450px" }}>
            <Card.Body>
                <h3 className="mb-4">Login</h3>
                {mutation.isError && (
                    <Alert variant="danger">{mutation.error?.response?.data?.message || "Something went wrong"}</Alert>
                )}
                <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" {...register("email")} isInvalid={!!errors.email} />
                        <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" {...register("password")} isInvalid={!!errors.password} />
                        <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
                    </Form.Group>
                    <Button type="submit" className="w-100" disabled={mutation.isPending}>
                        {mutation.isPending ? "Logging in..." : "Login"}
                    </Button>
                </Form>
                <p className="mt-3 text-center">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </Card.Body>
        </Card>
    );
}
