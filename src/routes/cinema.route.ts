import express, { Request, Response } from 'express';
import Cinema from '../models/Cinema';

const router = express.Router();

// Get All Cinemas
router.get('/', async (req: Request, res: Response) => {
    try {
        const cinemas = await Cinema.find().select('-__v');
        res.send(cinemas);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Create a cinema with N seats
router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, seats } = req.body;
        const cinema = new Cinema({ name, seats });
        await cinema.save();
        res.status(201).json({ id: cinema._id });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Purchase a specific seat number in cinema C
router.post('/:id/purchase/seat/:seatNumber', async (req: Request, res: Response) => {
    try {
        const cinemaId = req.params.id;
        const seatNumber = parseInt(req.params.seatNumber);

        const cinema = await Cinema.findById(cinemaId);
        if (!cinema) {
            return res.status(404).json({ error: 'Cinema not found' });
        }

        if (cinema.purchasedSeats.includes(seatNumber)) {
            return res.status(400).json({ error: 'Seat already purchased' });
        }

        cinema.purchasedSeats.push(seatNumber);
        await cinema.save();

        res.json({ seat: seatNumber });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Purchase the first two free consecutive seats in cinema C
router.post('/:id/purchase-consecutive-seats', async (req: Request, res: Response) => {
    try {
        const cinemaId = req.params.id;

        const cinema = await Cinema.findById(cinemaId);
        if (!cinema) {
            return res.status(404).json({ error: 'Cinema not found' });
        }

        let consecutiveSeats: number[] = [];

        for (let i = 1; i <= cinema.seats; i++) {
            if (
                !cinema.purchasedSeats.includes(i) &&
                !cinema.purchasedSeats.includes(i + 1)
            ) {
                consecutiveSeats = [i, i + 1];
                break;
            }
        }

        if (consecutiveSeats.length === 0) {
            return res.status(400).json({ error: 'No consecutive seats available' });
        }

        cinema.purchasedSeats.push(...consecutiveSeats);
        await cinema.save();

        res.json({ seats: consecutiveSeats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;