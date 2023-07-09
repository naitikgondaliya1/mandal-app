const { createAdvertisement, getadvertisement } = require("../methods/advertisement_method");
const { createBusiness, getBusiness, updateBusiness } = require("../methods/business_method");
const { createEvent, updloadPhoto, getEvent } = require("../methods/event_methods");
const { createNews, getNews } = require("../methods/news");
const { createSuchna, getSuchna, deleteSuchna } = require("../methods/suchna_methos");

module.exports = function (app) {


    const admin_methods = require("../methods/admin_methods");
    const mukhiya_methods = require("../methods/mukhiya_methods");
    const {totalMemberDirecter, villageMember, memberGet, memberProfile} = require('../methods/member_directore_methods')
    const {unMarriedMember, allVillage, memberByBlood, getImage, getMemberById} = require('../methods/member') 
    const { addCommityMember, getCommityMember } = require('../methods/cammity')


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
    app.get("/api/slider/fetch_all_slider_imgs", admin_methods.fatchAllSliderImages);
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
    //// Admin Login http://localhost:5000/api/headline/mukhiya_fatch_headline
    app.get("/api/headline/mukhiya_fatch_headline", mukhiya_methods.mukhiyafatchHeadLine);
    //// Admin Login http://localhost:5000/api/slider/mukhiya_fatch_all_slider_imgs
    app.get("/api/slider/mukhiya_fatch_all_slider_imgs", mukhiya_methods.mukhiyafatchAllSliderImages);
    app.get("/api/mukhiya/profile/photo/:filename", mukhiya_methods.mukhiyaProfilePhoto)
    app.get("/api/mukhiya/family", mukhiya_methods.getMukhiyaFamily)

     ////******************** member apis ******************////
     app.get("/api/totalMemberDirecter", totalMemberDirecter)
     app.get('/api/village/members', villageMember)
     app.get('/api/member/get', memberGet)
     app.get('/api/member/profile/photo/:filename', memberProfile)
     app.get('/api/unMarriedMember', unMarriedMember)
     app.get('/api/memberById',getMemberById)

     ////******************** cammity member add ******************////
    app.post('/api/cammitymember/add', addCommityMember)

    app.get('/api/commitymember', getCommityMember)


    ///############### Member by blood GROUP #################### ///
    app.get('/api/member/blood', memberByBlood)

    ///@@@@@@@@@@@@@@@@@  ALL VILLAGE ##################################### ///
    app.get('/api/village', allVillage)


    ///#########################  get any image ###################################//
    app.get('/api/image', getImage)


    /// #################### event APIS ############################ //
    app.post('/api/event/add', middleware.upload3.single("event_profile"), createEvent)
    app.post('/api/event/photo', middleware.upload3.single("event"), updloadPhoto)
    app.get('/api/event/get', getEvent)



    /// ########################## suchna API ##############################
    app.post('/api/suchna/create',middleware.suchnaPhoto.single("photo") ,createSuchna)
    app.get('/api/suchna/get', getSuchna)
    app.delete("/api/suchna/delete/:suchnaId", deleteSuchna)


    /// ############################### Advertisement APIS ######################
    app.post('/api/advertisement/create',middleware.advertisementPhoto.single("photo"),createAdvertisement)
    app.get('/api/advertisement/get',getadvertisement)

        /// ############################### Advertisement APIS ######################
        app.post('/api/business/create',middleware.businessPhoto.single("photo"),createBusiness)
        app.get('/api/business/get',getBusiness)
        app.patch('/api/business/update/:businessId',updateBusiness)

    /// ############################### news APIS ######################
    app.post('/api/news/create',middleware.newsPhoto.single("photo"),createNews)
    app.get('/api/news/get',getNews)
    
}