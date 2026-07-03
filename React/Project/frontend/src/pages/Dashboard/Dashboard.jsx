import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/slices/authSlice";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import API from "../../api/axios";

export default function Dashboard() {
    const dispatch = useDispatch();

    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ["me"],
        queryFn: () => API.get("/auth/me").then((res) => res.data.data),
    });

    const { data: notesData, isLoading: notesLoading } = useQuery({
        queryKey: ["notes", { page: 1, limit: 100 }],
        queryFn: () => API.get("/notes?limit=100").then((res) => res.data.data),
    });

    useEffect(() => {
        if (userData) {
            dispatch(setUser(userData));
        }
    }, [userData, dispatch]);

    if (userLoading || notesLoading) {
        return <div className="text-center mt-5"><Spinner animation="border" /></div>;
    }

    const notes = notesData?.notes || [];
    const totalNotes = notesData?.total || 0;
    const pinnedCount = notes.filter((n) => n.isPinned).length;
    const draftCount = notes.filter((n) => n.status === "draft").length;
    const publishedCount = notes.filter((n) => n.status === "published").length;

    return (
        <>
            <h2 className="mb-4">Welcome, {userData?.name}</h2>
            <Row className="g-3 mb-4">
                <Col sm={6} md={3}>
                    <Card className="text-center p-3">
                        <h5>{totalNotes}</h5>
                        <small>Total Notes</small>
                    </Card>
                </Col>
                <Col sm={6} md={3}>
                    <Card className="text-center p-3">
                        <h5>{pinnedCount}</h5>
                        <small>Pinned</small>
                    </Card>
                </Col>
                <Col sm={6} md={3}>
                    <Card className="text-center p-3">
                        <h5>{draftCount}</h5>
                        <small>Drafts</small>
                    </Card>
                </Col>
                <Col sm={6} md={3}>
                    <Card className="text-center p-3">
                        <h5>{publishedCount}</h5>
                        <small>Published</small>
                    </Card>
                </Col>
            </Row>
            <div className="d-flex gap-3">
                <Link to="/notes" className="btn btn-primary">View All Notes</Link>
                <Link to="/notes/create" className="btn btn-outline-primary">Create Note</Link>
            </div>
        </>
    );
}
