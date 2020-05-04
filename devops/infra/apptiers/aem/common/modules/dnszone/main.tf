resource "aws_route53_record" "www" {
  count           = length(var.records)
  zone_id         = var.zone_id
  name            = var.records[count.index]
  type            = var.type
  ttl             = "300"
  allow_overwrite = true
  records         = var.values
}
