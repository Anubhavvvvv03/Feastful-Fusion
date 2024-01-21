require('../models/database');
const Category=require('../models/Category');
const Recipe=require('../models/recipe');

// GET /
// homepage

exports.homepage=async(req,res)=>{

try {
    const limitNumber=5;
    const categories=await Category.find({}).limit(limitNumber);
    const latest=await Recipe.find({}).sort({_id:-1}).limit(limitNumber);
    const thai=await Recipe.find({'category':'Thai'}).limit(limitNumber);
    const indian=await Recipe.find({'category':'Indian'}).limit(limitNumber);
    const american=await Recipe.find({'category':'American'}).limit(limitNumber);
    

    const food={latest,thai,american,indian};

    res.render('index',{title:'Feastful Fusion-Home',categories,food});

} catch (error) {
    res.status(500).send({message:error.message||"Error Occured"});
}
}

// GET /
// categories

exports.ExploreCategories=async(req,res)=>{

    try {
        const limitNumber=20;
        const categories=await Category.find({}).limit(limitNumber);
        res.render('categories',{title:'Feastful Fusion-Categories',categories});
    
    } catch (error) {
        res.status(500).send({message:error.message||"Error Occured"});
    }
}


// GET /
// recipe/id

exports.ExploreRecipe=async(req,res)=>{

    try {
         let recipeId=req.params.id;
         const recipe=await Recipe.findById(recipeId);
         res.render('recipe',{title:'Feastful Fusion-Recipe',recipe});
    
    } catch (error) {
        res.status(500).send({message:error.message||"Error Occured"});
    }
}


// GET /
// ExploreCategoriesById

exports.ExploreCategoriesById=async(req,res)=>{

    try {

        let categoryId=req.params.id;
        const limitNumber=20;
        const categoryById=await Recipe.find({'category': categoryId}).limit(limitNumber);
        res.render('categories',{title:'Feastful Fusion-Categories',categoryById});
    
    } catch (error) {
        res.status(500).send({message:error.message||"Error Occured"});
    }
}

// POST /search
//  search Recipe
exports.searchRecipe=async(req,res)=>{

    try {
        let searchTerm=req.body.searchTerm;

        let recipe=await Recipe.find({$text:{$search:searchTerm, $diacriticSensitive: true}});
        //res.json(recipe);
        res.render('search',{title:'Feastful Fusion-Search',recipe});
        
    } catch (error) {
        res.status(500).send({message:error.message||"Error Occured"});
    }  

}



// GET /
// explore latest

exports.exploreLatest=async(req,res)=>{

    try {
        const limitNumber=20;
        const recipe=await Recipe.find({}).sort({_id:-1}).limit(limitNumber);
         res.render('explore-latest',{title:'Feastful Fusion-Explore recent',recipe});
    
    } catch (error) {
        res.status(500).send({message:error.message||"Error Occured"});
    }
}




// GET /
// explore random

exports.exploreRandom=async(req,res)=>{

    try {
         let count=await Recipe.find().countDocuments();
         let random=Math.floor(Math.random()*count);
         let recipe= await Recipe.findOne().skip(random).exec();
         res.render('explore-random',{title:'Feastful Fusion-Explore Random',recipe});
    
    } catch (error) {
        res.status(500).send({message:error.message||"Error Occured"});
    }
}

// GET /
// About

exports.about=async(req,res)=>{
    
    res.render('about',{title:'Feastful Fusion-About'});

}


// GET /
// submit recipe

exports.submitRecipe=async(req,res)=>{
    const infoErrorObj=req.flash('infoErrors');
    const infoSubmitObj=req.flash('infoSubmit');

    res.render('submit-recipe',{title:'Feastful Fusion-Submit Recipe',infoErrorObj,infoSubmitObj});

}

// POST/
// submit recipe on post

exports.submitRecipeOnPost=async(req,res)=>{

    try {

            let imageUploadFile;
            let uploadPath;
            let newImageName;

            if(!req.files || Object.keys(req.files).length===0){
                console.log("No file uploaded.")
            }else{
                imageUploadFile=req.files.image;
                newImageName=Date.now()+imageUploadFile.name;
                uploadPath=require('path').resolve('./')+'/public/uploads/'+newImageName;

                imageUploadFile.mv(uploadPath,function(err){
                    if(err) return res.status(500).send(err);
                })
            }



        const newRecipe=new Recipe({
            name :req.body.name,
            description:req.body.description,
            email:req.body.email,
            ingredients:req.body.ingredients,
            category:req.body.category,
            image:newImageName
        });

        await newRecipe.save();


        req.flash('infoSubmit','Recipe has been added.')
        res.redirect('/submit-recipe');

    } catch (error) {
        req.flash('infoErrors',error)
        res.redirect('/submit-recipe');

    }

}

//DELETE 
//delete customer
exports.deleteRecipe=async(req,res)=>{
    try{
        await Recipe.deleteOne({_id: req.params.id});
        req.flash('success', 'Recipe deleted successfully!');
        res.redirect("/");

    }catch(error)
    {
        console.log(error);
    }
};








// async function insertDymmyCategoryData(){
//   try {
//     await Category.insertMany([
//       {
//         "name": "Thai",
//         "image": "thai-food.jpg"
//       },
//       {
//         "name": "American",
//         "image": "american-food.jpg"
//       }, 
//       {
//         "name": "Chinese",
//         "image": "chinese-food.jpg"
//       },
//       {
//         "name": "Mexican",
//         "image": "mexican-food.jpg"
//       }, 
//       {
//         "name": "Indian",
//         "image": "indian-food.jpg"
//       },
//       {
//         "name": "Spanish",
//         "image": "spanish-food.jpg"
//       }
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyCategoryData()


// async function insertDymmyRecipeData(){
//   try {
//     await Recipe.insertMany([
//       { 
//         "name": "Crab cakes",
//         "description": `Preheat the oven to 175ºC
//          Gas Lightly grease a 22cm metal or glass pie dish with a little of the butter.\n
//         For the pie crust, blend the biscuits, sugar and remaining butter in a food processor until the mixture resembles breadcrumbs.\n 
//        Transfer to the pie dish and spread over the bottom and up the sides, firmly pressing down.\n       
//         Bake for 10 minutes, or until lightly browned. Remove from oven and place the dish on a wire rack to cool.\n        
//         For the filling, whisk the egg yolks in a bowl. Gradually whisk in the condensed milk until smooth.\n        
//         Mix in 6 tablespoons of lime juice, then pour the filling into the pie crust and level over with the back of a spoon.\n       
//          Return to the oven for 15 minutes, then place on a wire rack to cool.\n        
//          Once cooled, refrigerate for 6 hours or overnight.\n        
//          To serve, whip the cream until it just holds stiff peaks. Add dollops of cream to the top of the pie, and grate over some lime zest, for extra zing if you like.\n    \n `,
//         "email": "anubhavonnet01@outlook.com",
//         "ingredients": [
//             "4 large free-range egg yolks",
//             "400 ml condensed milk",
//             "5 limes",
//             "200 ml double cream"
//         ],
//         "category": "American", 
//         "image": "crab-cakes.jpg.jpg"
//       },
//       { 
//         "name": "Thai-style mussels",
//         "description": `Wash the mussels thoroughly, discarding any that aren’t tightly closed.\n
//          Trim and finely slice the spring onions, peel and finely slice the garlic. Pick and set aside the coriander leaves, then finely chop the stalks. Cut the lemongrass into 4 pieces, then finely slice the chilli.\n
//          In a wide saucepan, heat a little groundnut oil and soften the spring onion, garlic, coriander stalks, lemongrass and most of the red chilli for around 5 minutes.\n        \n `,
//         "email": "anubhavonnet01@outlook.com",
//         "ingredients": [
//           "1 kg mussels , debearded, from sustainable sources",
//           "groundnut oil",
//           "4 spring onions",
//           "2 cloves of garlic",
//           "½ a bunch of fresh coriander"
//         ],
//         "category": "Thai",
//         "image": "thai-style-mussels.jpg",
//       },
//       {
//         "name": "Thai-style mussels",
//         "description": `Peel and crush the garlic, then peel and roughly chop the ginger. Trim the greens, finely shredding the cabbage, if using. Trim and finely slice the spring onions and chilli. Pick the herbs.\n
//         Bash the lemongrass on a chopping board with a rolling pin until it breaks open, then add to a large saucepan along with the garlic, ginger and star anise.\n 
//         Place the pan over a high heat, then pour in the vegetable stock. Bring it just to the boil, then turn down very low and gently simmer for 30 minutes.\n `,
//         "email": "anubhavonnet01@outlook.com",
//         "ingredients": [
//              "3 cloves of garlic",
//              "5cm piece of ginger",
//              "200 g mixed Asian greens , such as baby pak choi, choy sum, Chinese cabbage",
//             "2 spring onions",
//             "1 fresh red chilli"
//             ],
//         "category": "Thai",
//         "image": "thai-inspired-vegetable-broth.jpg",
//       },
//       {
//         "name": "Thai-Chinese-inspired pinch salad",
//         "description": `Peel and very finely chop the ginger and deseed and finely slice the chilli (deseed if you like). Toast the sesame seeds in a dry frying pan until lightly golden, then remove to a bowl.\n 
//          Mix the prawns with the five-spice and ginger, finely grate in the lime zest and add a splash of sesame oil. Toss to coat, then leave to marinate.\n    \n`,
//         "email": "anubhavonnet01@outlook.com",
//         "ingredients": [
//           "5 cm piece of ginger",
//           "1 fresh red chilli",
//           "25 g sesame seeds",
//           "24 raw peeled king prawns , from sustainable sources (defrost first, if using frozen)",
//           "1 pinch Chinese five-spice powder"
//         ],
//         "category": "Chinese",
//         "image": "thai-chinese-inspired-pinch-salad.jpg",

//       },
//       {
//         "name": "Southern fried chicken",
//         "description": `\n To make the brine, toast the peppercorns in a large pan on a high heat for 1 minute, then add the rest of the brine ingredients and 400ml of cold water. Bring to the boil, then leave to cool, topping up with another 400ml of cold water.\n
//          Meanwhile, slash the chicken thighs a few times as deep as the bone, keeping the skin on for maximum flavour. Once the brine is cool, add all the chicken pieces, cover with clingfilm and leave in the fridge for at least 12 hours – I do this overnight.\n 
//          After brining, remove the chicken to a bowl, discarding the brine, then pour over the buttermilk, cover with clingfilm and place in the fridge for a further 8 hours, so the chicken is super-tender.\n 
//          When you’re ready to cook, preheat the oven to 190°C/375°F/gas .\n
//          Wash the sweet potatoes well, roll them in a little sea salt, place on a tray and bake for 30 minutes.\n
//           Meanwhile, make the pickle – toast the fennel seeds in a large pan for 1 minute, then remove from the heat. Pour in the vinegar, add the sugar and a good pinch of sea salt, then finely slice and add the cabbage. Place in the fridge, remembering to stir every now and then while you cook your chicken.\n`,
//         "email": "anubhavonnet01@outlook.com",
//         "ingredients": [
//           "4 free-range chicken thighs , skin on, bone in",
//           "4 free-range chicken drumsticks",
//           "200 ml buttermilk",
//           "4 sweet potatoes",
//           "200 g plain flour",
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika"
//         ],
//         "category": "American",
//         "image": "southern-friend-chicken.jpg",
//       },
//       {
//         "name": "Spring rolls",
//          "description": `Put your mushrooms in a medium-sized bowl, cover with hot water and leave for 10 minutes, or until soft. Meanwhile, place the noodles in a large bowl, cover with boiling water and leave for 1 minute. Drain, rinse under cold water, then set aside.\n
//          For the filling, finely slice the cabbage and peel and julienne the carrot. Add these to a large bowl with the noodles.\n `,
//         "email": "anubhavonnet01@outlook.com",
//         "ingredients": [
//              "40 g dried Asian mushrooms",
//              "50 g vermicelli noodles",
//              "200 g Chinese cabbage",
//              "1 carrot",
//              "3 spring onions"
//          ],
//         "category": "Chinese",
//         "image": "spring-rolls.jpg",
//       },
//       {
//         "name": "Paneer Kathi Rolls",
//          "description": `Mix all the marinade ingredients in a bowl. Add paneer and mix well\n
//          Heat 2 tablespoons of oil in a pan. Add onions, peppers, and ½ teaspoon of salt and cook for 3 to 4 minutes. Add marinated paneer and mix well. Cook for another 3 to 4 minutes. Turn the heat off and garnish with cilantro\n
//          Blend all the chutney ingredients using 2 tablespoons of water to make a smooth sauce. Note: Add more water as needed, a little at a time\n
//          Heat a non-stick griddle pan. Remove the Kawan paratha from the plastic wrapping and place it on the griddle. Cook on medium-high heat for about 1 to 1-½ minutes on each side or until both sides are golden brown, pressing gently with a spatula\n
//          Add 2 to 3 spoonfuls of the filling in the middle. Add a few sliced onions and cilantro on top. Love spicy? Add a few slices of pickled jalapenos. Roll the sides up to the middle. You can use small toothpicks to hold them together\n
//          Spread 2 teaspoons of chutney on the cooked paratha. Add 2 to 3 spoonfuls of the filling in the middle. Add a few sliced onions and cilantro on top. Love spicy? Add a few slices of pickled jalapenos. Roll the sides up to the middle. You can use small toothpicks to hold them together \n
//           `,
//         "email": "anubhavonnet01@outlook.com",
//         "ingredients": [
//              "200g Paneer",
//              "Mixed Bell Peppers",
//              "Red Onions",
//              "Spices",
//              "Green Chutney"
//          ],
//         "category": "Indian",
//         "image": "paneer-kathi-roll.jpg",
//       },
//       {
//         "name": "Pav Bhaji",
//         "description": `Select the high Sauté setting on the Instant Pot and heat 2 tablespoons of the butter. Add the yellow onion, ginger, garlic, and bell peppers, and sauté until the onion turns translucent about 5 minutes \n
//         Add the cauliflower, potatoes, tomatoes, peas, and 2 teaspoons salt; pour in the water; and stir well with a wooden spoon, nudging loose any browned bits from the pot bottom\n
//         Secure the lid and set the Pressure Release to Sealing. Press the Cancel button, then select the Pressure Cook or Manual setting and set the cooking time for 6 minutes at high pressure and perform a quick release by moving the Pressure Release to Venting. Open the pot. Select the normal Sauté setting and mash all the veggies with a potato masher\n
//         Stir in the tomato paste, pav bhaji masala, red chili powder, and turmeric, followed by 2 tablespoons butter (optional but highly recommended). Cover the pot with a glass lid (or another non-locking lid that fits), as the bhaji may start to splatter, and cook until heated through about 5 minutes. Taste and adjust the seasoning with salt, pav bhaji masala, and chile powder if needed. Press the Cancel button to turn off the Instant Pot. Sprinkle with the cilantro \n
//         Next, lightly butter and toast the pavs on a heated griddle or a pan\n      `,
//        "email": "anubhavonnet01@outlook.com",
//        "ingredients": [
//             "200g Butter",
//             "Vegetables",
//             "Ginger garlic",
//             "Tomato paste",
//             "Pav bhaji Masala",
//             "Spices"
//         ],
//        "category": "Indian",
//        "image": "pav-bhaji.jpg",
//       },
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyRecipeData();