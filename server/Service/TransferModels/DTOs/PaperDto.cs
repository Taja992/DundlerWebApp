﻿namespace Service.TransferModels.DTOs;

public class PaperDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public bool Discontinued { get; set; }
    public int Stock { get; set; }
    public double Price { get; set; }
    
}