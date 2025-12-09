require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shorturl')
const app = express()

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')

app.get('/', async (req, res) => {
    const sho = await ShortUrl.find()
    res.render('index', {sho: sho})
})

app.post('/shortUrls', async (req, res) => {
   await ShortUrl.create({full: req.body.FullUrl})
   res.redirect('/')
})

app.get('/:shortUrl', async(req,res)=>{
    const shortUrl = await ShortUrl.findOne({short: req.params.shortUrl})
    if(shortUrl==null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()
    
    res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5000, () => {
    console.log("Server running")
})
