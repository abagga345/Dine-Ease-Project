import request from "supertest"
import { app } from "../initial";
import { describe,expect,it, vi } from "vitest";
import { PrismaClient } from "@prisma/client";



vi.mock("../Routes/user/automail",()=>({
    sendOrderConfirmationEmail:vi.fn()
}))

vi.mock("../Routes/admin/cloudinary",()=>({
    connect:vi.fn()
}))

async function seed(): Promise<boolean> {
    const prisma = new PrismaClient();
    try {
      const creationDate = new Date();
  
    // not required for new containers at start
    // or do npx prisma migrate reset --force
    //   await prisma.orderItems.deleteMany();
    //   await prisma.orders.deleteMany();
    //   await prisma.reviews.deleteMany();
    //   await prisma.menu.deleteMany();
    //   await prisma.otpStatus.deleteMany();
    //   await prisma.address.deleteMany();
    //   await prisma.users.deleteMany();
    //   await prisma.store.deleteMany();
    //   await prisma.monthlySales.deleteMany();
    //   await prisma.$executeRawUnsafe(`ALTER SEQUENCE "OrderItems_id_seq" RESTART WITH 1`);
    //   await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Orders_id_seq" RESTART WITH 1`);
    //   await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Reviews_id_seq" RESTART WITH 1`);
    //   await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Menu_id_seq" RESTART WITH 1`);
    //   await prisma.$executeRawUnsafe(`ALTER SEQUENCE "OtpStatus_id_seq" RESTART WITH 1`);
    //   await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Address_id_seq" RESTART WITH 1`);
    //   await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Users_id_seq" RESTART WITH 1`);
    //   await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Store_id_seq" RESTART WITH 1`);


      
      await prisma.$transaction([
        prisma.store.create({
          data: {
            storeId: "FlyHigher",
            storeStreet: "Z Block",
            state: "New Delhi",
            pincode: "110000",
            id: 1,
          },
        }),
  
        prisma.menu.createMany({
          data: [
            {
              imageUrl: "http://test.com",
              title: "Veg Dominator",
              amount: 100,
              description: "Filled with veggies",
              visibility: true,
              available: true,
              id: 1,
              storeId: "FlyHigher",
            },
            {
              imageUrl: "http://test.com",
              title: "Chicken Dominator",
              amount: 110,
              description: "Juiciest chicken",
              visibility: true,
              available: true,
              id: 2,
              storeId: "FlyHigher",
            },
          ],
        }),
  
        prisma.users.createMany({
          data: [
            {
              firstName: "Saakshat",
              lastName: "Jain",
              email: "saakshatjain@gmail.com",
              password: "$2b$05$YMM/9An92.Z4d3bvU8Ggy.miuQueGgE0kN4a8EUksj7doL.BuzxeC",
              contactNo: "9999999999",
              role: "User",
              id: 2,
            },
            {
              firstName: "Aayush",
              lastName: "Bagga",
              email: "aayushbagga2005@gmail.com",
              password: "$2b$05$YMM/9An92.Z4d3bvU8Ggy.miuQueGgE0kN4a8EUksj7doL.BuzxeC",
              contactNo: "9999999999",
              role: "Admin",
              storeId: "FlyHigher",
              id: 1,
            },
          ],
        }),
  
        prisma.otpStatus.createMany({
          data: [
            {
              email: "aayushbagga2005@gmail.com",
              id: 1,
              otp: "$2b$05$3BKdwf9VgUGzXzIfNr1Z3./NFTSQMpw9/jSK7ZdbleZg50II2Jgde",
              verified: true,
              creationDate: creationDate,
              expirationDate: new Date(creationDate.getTime() + 15 * 60_000),
            },
            {
              email: "saakshatjain@gmail.com",
              id: 2,
              otp: "$2b$05$3BKdwf9VgUGzXzIfNr1Z3./NFTSQMpw9/jSK7ZdbleZg50II2Jgde",
              verified: true,
              creationDate: creationDate,
              expirationDate: new Date(creationDate.getTime() + 15 * 60_000),
            },
          ],
        }),
      ]);
  
      return true;
    } catch (err) {
      console.error(err);
      return false;
    } 
  }
  

describe("Setting Test data",()=>{
    it("Initial seed",async ()=>{
        const res=await seed();
        expect(res).toBe(true);
    })
    
})
describe("User Workflow Testing",()=>{
    let token:string="";
    describe("Signin Testing",()=>{
        it("TestCase 1",async ()=>{
            const res=await request(app).post("/api/v1/user/signin").send({
                email:"saakshatjain@gmail.com",
                password:"AAYUSHBAGGA"
            })
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Successful sign in")
            expect(res.body.token).not.toBeNull();
            expect(res.body.token).not.toBeUndefined();
            token=res.body.token
        })
    })
    describe("Verify Role",()=>{
        it("TestCase 1",async ()=>{
            const res=await request(app).get('/api/v1/user/verifyrole').set({
                authorization:token
            })
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Role checked successfully")
            expect(res.body.role).toBe("User")
            expect(res.body.verified).toBe(true)
        })
    })
    describe("Add Address Testing",()=>{
        it("TestCase 1",async ()=>{
            const res=await request(app).post('/api/v1/user/addaddress').set({
                authorization:token
            }).send({
                houseStreet:"XYZ street",
                state:"New Delhi",
                pincode:"110000",
            })
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Address Added successfully")
            expect(res.body.address).not.toBeNull();
            expect(res.body.address).not.toBeUndefined();
        })
        it("TestCase 2",async ()=>{
            const res=await request(app).post('/api/v1/user/addaddress').set({
                authorization:token
            }).send({
                houseStreet:"Gamma street",
                state:"Punjab",
                pincode:"110020",
            })
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Address Added successfully")
            expect(res.body.address).not.toBeNull();
            expect(res.body.address).not.toBeUndefined();
        })
    })
    describe("Get Address Testing",()=>{
        it("TestCase 1",async ()=>{
            const res=await request(app).get('/api/v1/user/getaddresses').set({
                authorization:token
            }).send()
            expect(res.statusCode).toBe(200);
            expect(res.body.addresses).not.toBeNull();
            expect(res.body.addresses).not.toBeUndefined();
            expect(res.body.addresses.length).toBe(2);
        })
    })
    describe("Edit Address Testing",()=>{
        it("TestCase 1",async ()=>{
            const res=await request(app).put('/api/v1/user/editaddress?id=1').set({
                authorization:token
            }).send({
                houseStreet:"ABC street",
                pincode:"110002",
            })
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Address updated successfully")
            expect(res.body.address).not.toBeNull();
            expect(res.body.address).not.toBeUndefined();
            expect(Object.keys(res.body.address)).toEqual(
                expect.arrayContaining(["id", "email", "houseStreet", "state", "pincode", "availability"])
            );
              
        })
    })
    describe("Delete Address Testing",()=>{
        it("TestCase 1",async ()=>{
            const res=await request(app).delete('/api/v1/user/deleteaddress?id=2').set({
                authorization:token
            }).send()
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Address removed successfully")
        })
    })
    describe("View Profile",()=>{
        it("TestCase 1",async ()=>{
            const res=await request(app).get('/api/v1/user/viewprofile').set({
                authorization:token
            }).send()
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Profile fetched successfully")
            expect(res.body.firstName).toBe("Saakshat");
            expect(res.body.lastName).toBe("Jain");
            expect(res.body.contactNo).toBe("9999999999");
            expect(res.body.email).toBe("saakshatjain@gmail.com");
        })
    })
    describe("Edit Profile Testing",()=>{
        it("TestCase 1",async ()=>{
            const res=await request(app).put('/api/v1/user/editprofile').set({
                authorization:token
            }).send({
                lastName:"XYZ" ,
                contactNo:"8888888888",
            })
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Profile updated successfully")
            expect(res.body.profile.firstName).toBe("Saakshat")
            expect(res.body.profile.lastName).toBe("XYZ")
            expect(res.body.profile.contactNo).toBe("8888888888")
        })
    })
    describe("View Menu Testing",()=>{
        it("TestCase 1",async ()=>{
            const res=await request(app).get("/api/v1/user/viewmenu?storeId=FlyHigher").send();
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("items");
            expect(res.body.items.length).toBe(2);
            expect(res.body.items[0].available).toBe(true);
            expect(res.body.items[1].available).toBe(true);
        })
    })
    describe("Checkout Testing",()=>{
        it("TestCase 1",async ()=>{
            const res=await request(app).post("/api/v1/user/checkout").set({
                authorization:token
            }).send({
                amount:308,
                description:"",
                addressId:1,
                paymentMethod:"UPI",
                storeId:"FlyHigher",
                items:[
                    {
                        id:1,
                        quantity:1
                    },{
                        id:2,
                        quantity:1
                    }
                ]
            })
           
            expect(res.statusCode).toBe(200)
            expect(res.body.message).toBe("Order placed successfully")
            expect(res.body.orderId).toBe(1)
        })
    })
    describe("View orders Testing",()=>{
        it("TestCase 1",async ()=>{
            const res=await request(app).get("/api/v1/user/vieworders").set({
                authorization:token
            }).send();
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("orders");
            expect(res.body.orders.length).toBe(1);
            expect(res.body.orders[0]["items"].length).toBe(2);
            expect(res.body.orders[0]["status"]).toBe("Unconfirmed")
            expect(res.body.orders[0]["store"]["storeStreet"]).toBe("Z Block")
        })
    })
    describe("Drop Review Testing",()=>{
        it("TestCase 1",async ()=>{
            const res=await request(app).post("/api/v1/user/dropreview").set({
                authorization:token
            }).send({
                description:"Tasty",
                rating:5,
                itemId:1
            })
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Review added successfully");
            expect(res.body).toHaveProperty("review");
            expect(res.body.review.description).toBe("Tasty");
            expect(res.body.review.rating).toBe(5);
            expect(res.body.review.user.firstName).toBe("Saakshat");
            expect(res.body.review.user.lastName).toBe("XYZ");
        })
        it("TestCase 2",async ()=>{
            const res=await request(app).post("/api/v1/user/dropreview").set({
                authorization:token
            }).send({
                description:"Delicious",
                rating:6,
                itemId:1
            })
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe("INVALID REVIEW");
        })
    })
    describe("View Reviews Testing",()=>{
        it("TestCase 1",async ()=>{
            const res=await request(app).get("/api/v1/user/viewreviews?itemId=1").send();
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("reviews");
            expect(res.body.reviews.length).toBe(1);
            expect(res.body.reviews[0].rating).toBe(5);
        })
    })
    describe("View Menu Item Testing",()=>{
        it("TestCase 1",async ()=>{
            const res=await request(app).get("/api/v1/user/viewmenuitem?itemId=1").send();
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Item fetched successfully")
            expect(res.body.imageUrl).toBe("http://test.com");
            expect(res.body.description).toBe("Filled with veggies");
            expect(res.body.title).toBe("Veg Dominator");
        })
    })
    
    describe("Verify Otp Testing",()=>{
        it("TestCase 1",async ()=>{
            const res=await request(app).put("/api/v1/user/verifyotp").send({
                email:"saakshatjain@gmail.com",
                otp:"774852"
            })
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("User Verified Successfully")
        })
    })
    // NOT INTEGRATED IN APPLICATION LEVEL SO NO TESTING REQD
    // describe("Edit Review",()=>{
    //     it("TestCase 1",async ()=>{
            
    //     })
    // })
    // describe("Delete Review",()=>{
    //     it("TestCase 1",async ()=>{
            
    //     })
    // })

})

describe("Admin Workflow Testing",()=>{
    let token:string="";
    describe("Signin Testing",()=>{
        it("TestCase 1",async ()=>{
            const res=await request(app).post("/api/v1/user/signin").send({
                email:"aayushbagga2005@gmail.com",
                password:"AAYUSHBAGGA"
            })
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Successful sign in")
            expect(res.body.token).not.toBeNull();
            expect(res.body.token).not.toBeUndefined();
            token=res.body.token
        })
    })
    describe("Verify Role",()=>{
        it("TestCase 1",async ()=>{
            const res=await request(app).get('/api/v1/user/verifyrole').set({
                authorization:token
            })
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Role checked successfully")
            expect(res.body.role).toBe("Admin")
            expect(res.body.verified).toBe(true)
        })
    })
    describe("Add item",()=>{
        it("TestCase 1",async ()=>{
            const res=await request(app).post("/api/v1/admin/additem").set({
                authorization:token
            }).send({
                imageUrl:"http://test.com",
                title:"Mutton Dominator",
                amount:100,
                description:"Juiciest Mutton",
                visibility:true,
                available:true,
                id:3,
                storeId:"FlyHigher"
            })
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Item added successfully")
            expect(res.body.itemId).toBe(3);
        })
    })
    describe("Change Visibility Testing",()=>{
        it("TestCase 1",async ()=>{
            const res=await request(app).put("/api/v1/admin/changevisibility").set({
                authorization:token
            }).send({
                visibility:false,
                id:3
            })
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Updation Successful")

        })
    })
    describe("Delete Item Testing",()=>{
        it("TestCase 1",async ()=>{
            const res=await request(app).put("/api/v1/admin/deleteitem?id=3").set({
                authorization:token
            }).send()
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Menu Item deleted successfully")
        })
    })
    describe("Unconfirmed Orders",()=>{
        it("TestCase 1",async ()=>{
            const res=await request(app).get("/api/v1/admin/unconfirmedorders").set({
                authorization:token
            }).send()
            expect(res.statusCode).toBe(200);
            expect(res.body.orders.length).toBe(1);
            expect(res.body.orders[0].email).toBe("saakshatjain@gmail.com")
            expect(res.body.orders[0].amount).toBe(308)
            expect(res.body.orders[0].status).toBe("Unconfirmed")
            
        })
    })
    describe("Change Status Testing",()=>{
        it("TestCase 1",async ()=>{
            const res=await request(app).put("/api/v1/admin/changestatus").set({
                authorization:token
            }).send({
                orderId:1,
                status:"Delivered"
            })
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Status updated successfully");
        })
    })
    describe("All Items Testing",()=>{
        it("TestCase 1",async ()=>{
            const res=await request(app).get("/api/v1/admin/allitems").set({
                authorization:token
            }).send()
            expect(res.statusCode).toBe(200);
            expect(res.body.items.length).toBe(2)
        })
    })
    describe("Total Day Sales",()=>{
        it("TestCase 1",async ()=>{
            const res=await request(app).get("/api/v1/admin/totaldaysales").set({
                authorization:token
            }).send()
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Total day sales fetched successfully");
            expect(res.body.totalSales).toBe(308)
        })
    })
    describe("Total Monthly Sales",()=>{
        it("TestCase 1",async ()=>{
            const res=await request(app).get("/api/v1/admin/totalmonthlysales").set({
                authorization:token
            }).send()
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Total monthly sales fetched successfully");
            expect(res.body.total).toBe(308)
        })
    })
    describe("Chart Data",()=>{
        it("TestCase 1",async ()=>{
            const res=await request(app).get("/api/v1/admin/chartdata").set({
                authorization:token
            }).send()
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Chart Data fetched successfully");
            expect(res.body.avgReview).toBe(5);
            expect(res.body.visibleCount).toBe(2);
            expect(res.body.totalSales).toBe(308)
            expect(res.body.totalReviews).toBe(1)
        })

    })
    describe("All Orders",()=>{
        it("TestCase 1",async ()=>{
            const res=await request(app).get("/api/v1/admin/allorders?storeId=FlyHigher").set({
                authorization:token
            }).send()
            expect(res.statusCode).toBe(200);
            expect(res.body.orders.length).toBe(1);
            expect(res.body.orders[0]["status"]).toBe("Delivered")
        })
    })
    describe("View Order Items",()=>{
        it("TestCase 1",async ()=>{
            const res=await request(app).get("/api/v1/admin/vieworderitems?orderId=1").set({
                authorization:token
            }).send();
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Items fetched successfully")
            expect(res.body.items.length).toBe(2)

        })
    })
    describe("Order Counts",()=>{
        it("TestCase 1",async ()=>{
            const res=await request(app).get("/api/v1/admin/ordercounts").set({
                authorization:token
            }).send();
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Order counts fetched successfully")
            expect(res.body.orderCounts.length).toBe(1);
            expect(res.body.orderCounts[0]["_count"]["id"]).toBe(1);
            expect(res.body.orderCounts[0]["status"]).toBe("Delivered")
            
        })
    })
    

})


