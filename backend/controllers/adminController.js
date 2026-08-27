export const adminDashbord = (req, res) =>{
    res.json({
        message: "Welcome to admin dashboard",
        user: req.user // { userId, role } — comes from JWT via requireAuth
    });
}