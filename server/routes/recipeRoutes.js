const express=require('express');
const router=express.Router();
const recipeController=require('../controllers/recipeController');

// App Routes
router.get('/',recipeController.homepage);
router.get('/categories',recipeController.ExploreCategories);
router.get('/recipe/:id',recipeController.ExploreRecipe);
router.get('/categories/:id',recipeController.ExploreCategoriesById);
router.get('/explore-latest',recipeController.exploreLatest);
router.get('/explore-random',recipeController.exploreRandom);
router.get('/submit-recipe',recipeController.submitRecipe);
router.get('/about',recipeController.about);
router.post('/submit-recipe',recipeController.submitRecipeOnPost);
router.post('/search',recipeController.searchRecipe);




module.exports=router;