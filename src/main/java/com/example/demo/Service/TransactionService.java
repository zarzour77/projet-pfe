package com.example.demo.Service;


import com.example.demo.model.Transaction;
import com.example.demo.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;

    @Autowired
    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public Optional<Transaction> getTransactionById(Long id) {
        return transactionRepository.findById(id);
    }

    public Transaction createTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public Transaction updateTransaction(Long id, Transaction updatedTransaction) {
        return transactionRepository.findById(id).map(transaction -> {
            transaction.setMontant(updatedTransaction.getMontant());
            transaction.setDate(updatedTransaction.getDate());
            transaction.setType(updatedTransaction.getType());
            transaction.setExpéditeur(updatedTransaction.getExpéditeur());
            transaction.setDestinataire(updatedTransaction.getDestinataire());
            transaction.setMission(updatedTransaction.getMission());
            return transactionRepository.save(transaction);
        }).orElseThrow(() -> new RuntimeException("Transaction not found with id " + id));
    }

    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }
}

