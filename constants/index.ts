    export const Navlink = [
        {
        label: 'Home',
        route: '/Home',
        },
        {
        label: 'Car For Sale',
        route: '/car',
        },
        {
        label: 'House For Rent',
        route: '/house',
        },
        {
        label: 'Items For Sale',
        route: '/items',
        },
        {
        label: 'About Us',
        route: '../components/AboutUs',
        },
    ]
    
    export const CampaignDefaultValues = {
        title: '',
        description: '',
        location: '',
        imageUrl: '',
        startDateTime: new Date(),
        endDateTime: new Date(),
        categoryId: '',
        price: '',
        isFree: false,
        url: '',
    }