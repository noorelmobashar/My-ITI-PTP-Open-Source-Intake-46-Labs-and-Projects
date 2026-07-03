import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../store/slices/authSlice";
import { useState, useEffect } from "react";
import { Card, Spinner, Alert, Form, Button } from "react-bootstrap";
import API from "../../api/axios";

export default function Profile() {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const { user } = useSelector((state) => state.auth);
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [editing, setEditing] = useState(false);

    const { data: userData, isLoading } = useQuery({
        queryKey: ["me"],
        queryFn: () => API.get("/auth/me").then((res) => res.data.data),
    });

    useEffect(() => {
        if (userData) {
            dispatch(setUser(userData));
            setName(userData.name);
        }
    }, [userData, dispatch]);

    const mutation = useMutation({
        mutationFn: (formData) => API.patch("/auth/me", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
        onSuccess: (res) => {
            dispatch(setUser(res.data.data));
            queryClient.invalidateQueries({ queryKey: ["me"] });
            setEditing(false);
            setImage(null);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (name) formData.append("name", name);
        if (image) formData.append("profileImage", image);
        mutation.mutate(formData);
    };

    if (isLoading) {
        return <div className="text-center mt-5"><Spinner animation="border" /></div>;
    }

    const displayUser = userData || user;

    return (
        <Card className="mx-auto" style={{ maxWidth: "500px" }}>
            <Card.Body>
                <h3 className="mb-4">Profile</h3>
                {mutation.isError && (
                    <Alert variant="danger">{mutation.error?.response?.data?.message || "Something went wrong"}</Alert>
                )}
                {mutation.isSuccess && <Alert variant="success">Profile updated!</Alert>}

                {displayUser?.profileImage && (
                    <div className="text-center mb-3">
                        <img
                            src={`http://localhost:5000${displayUser.profileImage}`}
                            alt="Profile"
                            style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}
                        />
                    </div>
                )}

                {!editing ? (
                    <>
                        <p><strong>Name:</strong> {displayUser?.name}</p>
                        <p><strong>Email:</strong> {displayUser?.email}</p>
                        <p><strong>Joined:</strong> {new Date(displayUser?.createdAt).toLocaleDateString()}</p>
                        <Button onClick={() => { setEditing(true); setName(displayUser?.name || ""); }}>Edit Profile</Button>
                    </>
                ) : (
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Profile Image</Form.Label>
                            <Form.Control type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                        </Form.Group>
                        <div className="d-flex gap-2">
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending ? "Saving..." : "Save"}
                            </Button>
                            <Button variant="outline-secondary" onClick={() => setEditing(false)}>Cancel</Button>
                        </div>
                    </Form>
                )}
            </Card.Body>
        </Card>
    );
}
