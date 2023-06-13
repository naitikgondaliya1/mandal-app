module.exports = function (app) {


    const admin_methods = require("../methods/admin_methods");
    const mukhiya_methods = require("../methods/mukhiya_methods");


    const middleware = require("../middleware/headermiddleware");

    ////******************** admin apis ******************////
    //// Admin Login http://localhost:5000/api/admin/admin_login
    app.post("/api/admin/admin_login", admin_methods.adminLogin);
    //// Admin Login http://localhost:5000/api/headline/edit_headline/:id
    app.put("/api/headline/edit_headline/:id", admin_methods.editHeadLine);
    //// Admin Login http://localhost:5000/api/headline/fatch_headline
    app.get("/api/headline/fatch_headline", admin_methods.fatchHeadLine);
    //// Admin Login http://localhost:5000/api/mukhya_member/create_mukhya_member
    app.post("/api/mukhya_member/create_mukhya_member", admin_methods.creatMember);
    //// Admin Login http://localhost:5000/api/slider/add_slider_img
    app.post("/api/slider/add_slider_img", middleware.upload.single("image"), admin_methods.addsliderImage);
    //// Admin Login http://localhost:5000/api/slider/fetch_all_slider_imgs
    app.post("/api/slider/fetch_all_slider_imgs", admin_methods.fatchAllSliderImages);
    //// Admin Login http://localhost:5000/api/slider/delete_slider_img/:id
    app.delete("/api/slider/delete_slider_img/:id", admin_methods.deleteSliderImageById);
    //// Admin Login http://localhost:5000/api/slider/admin/edit_mukhya_member/:id
    app.put("/api/slider/admin/edit_mukhya_member/:id", admin_methods.editMember);
    //// Admin Login http://localhost:5000/api/slider/admin/fatch_all_members
    app.get("/api/slider/admin/fatch_all_members", admin_methods.fatchAllMembers);


    ////******************** mukhiyas apis ******************////
    //// Admin Login http://localhost:5000/api/mukhya_member/login_mukhya_member
    app.post("/api/mukhya_member/login_mukhya_member", mukhiya_methods.mukhiyaLogin);
    //// Admin Login http://localhost:5000/api/mukhya_member/edit_mukhya_member
    app.put("/api/mukhya_member/edit_mukhya_member", middleware.upload1.single("profile_photo"), mukhiya_methods.editMukhiyaDetails);
    //// Admin Login http://localhost:5000/api/mukhya_member/change_password
    app.put("/api/mukhya_member/change_password", mukhiya_methods.changePassword);
    //// Admin Login http://localhost:5000/api/mukhya_member/fatch_mukhiya_profile
    app.get("/api/mukhya_member/fatch_mukhiya_profile", mukhiya_methods.fatchMukhiyaProfile);
    //// Admin Login http://localhost:5000/api/mukhya_member/add_member_details
    app.post("/api/mukhya_member/add_member_details", middleware.upload2.single("profile_photo"), mukhiya_methods.addMembarDetails);
    //// Admin Login http://localhost:5000/api/mukhya_member/edit_member_details
    app.put("/api/mukhya_member/edit_member_details", middleware.upload2.single("profile_photo"), mukhiya_methods.editMemberDetails);
    //// Admin Login http://localhost:5000/api/slider/remove_member/:id
    app.delete("/api/slider/remove_member/:id", mukhiya_methods.removeMemberById);
}