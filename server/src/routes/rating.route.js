import express from 'express';
import { submitReview, getReviews } from '../controller/rating/ratingController.js';

const router = express.Router();

router.post('/rating', submitReview);
router.get('/rating/:id', getReviews);

export default router;