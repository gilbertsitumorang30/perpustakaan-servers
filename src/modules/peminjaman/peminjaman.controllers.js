const { QueryTypes } = require("sequelize");
const db = require("./../../config/database.connection");
const Peminjaman = require("./peminjaman.model");
const moment = require("moment");

exports.panggilSemuaPeminjaman = async (req, res) => {
  try {
    const sql = `select pjm.id, pjm.tanggal_pinjam, pjm.tanggal_pesan, pjm.tanggal_harus_kembali, pjm.status, a.nama as nama_anggota, p.nama as nama_petugas, b.judul as judul_buku from peminjaman as pjm
    join anggota as a on (pjm.id_anggota = a.id)
    join petugas as p on (pjm.id_petugas = p.id)
    join buku as b on (pjm.id_buku = b.id)
    where pjm.status = "diterima" order by pjm.tanggal_pinjam desc`;
    const peminjaman = await db.query(sql, {
      type: QueryTypes.SELECT,
    });
    res.status(200).json({
      status: res.statusCode,
      msg: "Data peminjaman berhasil di panggil",
      data: peminjaman,
    });
  } catch (error) {
    res.status(404).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};

exports.batalkanPeminjaman = async (req, res) => {
  try {
    const peminjaman = await Peminjaman.findAll({
      where: {
        status: "menunggu",
      },
    });
    peminjaman.forEach(async (item) => {
      if (moment(item.tanggal_pesan) > moment().add(2, "d").endOf("days")) {
        await Peminjaman.update(
          {
            status: "ditolak",
          },
          {
            where: {
              id: item.id,
            },
          }
        );
      }
    });
    res.status(200).json({
      status: res.statusCode,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.panggilRiwayatPeminjaman = async (req, res) => {
  try {
    const sql = `select pjm.id, pjm.tanggal_pinjam, pjm.tanggal_pesan, pjm.tanggal_harus_kembali, pjm.status, a.nama as nama_anggota, p.nama as nama_petugas, b.judul as judul_buku from peminjaman as pjm
    join anggota as a on (pjm.id_anggota = a.id)
    join petugas as p on (pjm.id_petugas = p.id)
    join buku as b on (pjm.id_buku = b.id)
    where pjm.status = "kembali"`;
    const peminjaman = await db.query(sql, {
      type: QueryTypes.SELECT,
    });
    res.status(200).json({
      status: res.statusCode,
      msg: "Riwayat peminjaman berhasil di panggil",
      data: peminjaman,
    });
  } catch (error) {
    res.status(404).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};

exports.panggilSemuaPesanan = async (req, res) => {
  try {
    const sql = `select pjm.id, pjm.tanggal_pinjam, pjm.tanggal_pesan, pjm.tanggal_harus_kembali, pjm.status, a.nama as nama_anggota, p.nama as nama_petugas, b.judul as judul_buku from peminjaman as pjm
    join anggota as a on (pjm.id_anggota = a.id)
    join petugas as p on (pjm.id_petugas = p.id)
    join buku as b on (pjm.id_buku = b.id)
    where pjm.status = "menunggu"`;
    const peminjaman = await db.query(sql, {
      type: QueryTypes.SELECT,
    });
    res.status(200).json({
      status: res.statusCode,
      msg: "Data pesanan berhasil di panggil",
      data: peminjaman,
    });
  } catch (error) {
    res.status(404).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};

exports.panggilPeminjamanById = async (req, res) => {
  try {
    const sql = `select pjm.id, pjm.tanggal_pinjam, pjm.tanggal_pesan, pjm.tanggal_harus_kembali, pjm.status, a.nama as nama_anggota, p.nama as nama_petugas, b.judul as judul_buku from peminjaman as pjm
      join anggota as a on (pjm.id_anggota = a.id)
      join petugas as p on (pjm.id_petugas = p.id)
      join buku as b on (pjm.id_buku = b.id) where pjm.id = ${req.params.id}`;
    const peminjaman = await db.query(sql, {
      type: QueryTypes.SELECT,
    });
    res.status(200).json({
      status: res.statusCode,
      msg: "Data peminjaman berhasil di panggil",
      data: peminjaman[0],
    });
  } catch (error) {
    res.status(404).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};
