const fs =  require('fs')
const data =  fs.readFileSync('./data.json', 'utf-8')
const parkingTickets = JSON.parse(data)
const argv = process.argv.splice(2)

if (argv[0] === 'in') {
    let ticket = {
        id: !parkingTickets[0] ? 1 : parkingTickets[parkingTickets.length - 1].id + 1,
        no_polisi: argv[1],
        jenis_kendaraan: argv[2],
        waktu_masuk: new Date(),
        waktu_keluar: null,
        base_cost: argv[2] === 'mobil' ? 8000 : 4000,
        total_cost: 0
    }
    parkingTickets.push(ticket)
    fs.writeFileSync('./data.json', JSON.stringify(parkingTickets), { encoding: 'utf-8' })
    console.log(`kendaraan dengan nomor polisi ${ticket.no_polisi} telah masuk.\nTime: ${ticket.waktu_masuk}`);
} else if (argv[0] === 'out') {
    let id = +argv[1]
    let findTicket = parkingTickets.find(ticket => ticket.id === id && !ticket.waktu_keluar)
    let findTicketIndex = parkingTickets.findIndex(ticket => ticket.id === id && !ticket.waktu_keluar)
    if (!findTicket) {
        console.log(`kendaraan tidak ditemukan`);
        return
    } 
    let dateNow = new Date()
    let dateGetIn = new Date(findTicket.waktu_masuk)
    var hours = Math.ceil(Math.abs(dateNow - dateGetIn) / 36e5);
    findTicket.waktu_keluar = new Date()
    findTicket.total_cost = hours * findTicket.base_cost
    parkingTickets[findTicketIndex] = findTicket
    console.log(`kendaraan dengan nomor polisi ${findTicket.no_polisi} telah keluar.\nTime: ${findTicket.waktu_masuk}\nTotal cost: ${findTicket.total_cost}`);
    fs.writeFileSync('./data.json', JSON.stringify(parkingTickets), { encoding: 'utf-8' })
}